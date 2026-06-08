from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
import bcrypt
from urllib.parse import urlencode, quote_plus
import hashlib
from functools import wraps
import cloudinary
import cloudinary.uploader
import re

#===========================
# APP CONFIG 
#===========================
load_dotenv()

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "https://learnovahub.co.za",
                "https://www.learnovahub.co.za",
                "https://learnovahub.vercel.app",
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ],
            "allow_headers": [
                "Content-Type",
                "Authorization"
            ],
            "methods": [
                "GET",
                "POST",
                "PATCH",
                "DELETE",
                "OPTIONS"
            ]
        }
    }
)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

#===========================
# EXTENSIONS 
#===========================
db = SQLAlchemy(app)
jwt = JWTManager(app)

#===========================
# DECORATORS 
#===========================
def admin_required(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):

        current_user_id = get_jwt_identity()

        user = User.query.get(current_user_id)

        if not user or user.role != "admin":
            return jsonify({
                "message": "Admin access required"
            }), 403

        return fn(*args, **kwargs)

    return wrapper

#===========================
# MODELS 
#===========================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(
        db.String(120),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        default="learner"
    )

    is_subscribed = db.Column(
        db.Boolean,
        default=False
    )

    subscription_type = db.Column(
        db.String(50),
        nullable=True
    )

    profile_pic_url = db.Column(
        db.String(255),
        nullable=True
    )

    subscription_expires_at = db.Column(
        db.DateTime,
        nullable=True
    )

    lessons = db.relationship(
        "Lesson",
        backref="teacher",
        lazy=True
    )

class Lesson(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)

    topic = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text)

    video_url = db.Column(db.String(500))

    worksheet_url = db.Column(db.String(500))

    is_premium = db.Column(db.Boolean, default=True)

    course_id = db.Column(
        db.Integer,
        db.ForeignKey("course.id"),
        nullable=True
    )

    course = db.relationship(
        "Course",
        backref="lessons"
    )

    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=True
    )

class QuizQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    lesson_id = db.Column(
        db.Integer,
        db.ForeignKey("lesson.id"),
        nullable=False
    )

    question = db.Column(db.Text, nullable=False)

    option_a = db.Column(db.String(255), nullable=False)
    option_b = db.Column(db.String(255), nullable=False)
    option_c = db.Column(db.String(255), nullable=False)
    option_d = db.Column(db.String(255), nullable=False)

    correct_answer = db.Column(db.String(1), nullable=False)

    lesson = db.relationship(
        "Lesson",
        backref="quiz_questions"
    )

class QuizResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    lesson_id = db.Column(
        db.Integer,
        db.ForeignKey("lesson.id"),
        nullable=False
    )

    score = db.Column(db.Integer, nullable=False)

    total_questions = db.Column(db.Integer, nullable=False)

    user = db.relationship("User", backref="quiz_results")
    lesson = db.relationship("Lesson", backref="quiz_results")

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    amount = db.Column(db.Float, nullable=False)

    status = db.Column(
        db.String(30),
        default="pending"
    )

    payment_method = db.Column(
        db.String(50),
        default="payfast"
    )

    subscription_type = db.Column(
        db.String(50),
        nullable=False
    )

    user = db.relationship("User", backref="payments")

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(
        db.String(255),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    link =db.Column(
        db.String(255)
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    target_role = db.Column(
        db.String(20),
        default="all"
    )

class LessonCompletion(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    lesson_id = db.Column(
        db.Integer,
        db.ForeignKey("lesson.id"),
        nullable=False
    )

    completed_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = db.relationship(
        "User",
        backref="completed_lessons"
    )

    lesson = db.relationship(
        "Lesson",
        backref="lesson_completions"
    )

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )
    
    learning_outcomes = db.Column(
        db.Text,
        nullable=True
    )

    price = db.Column(
        db.Float,
        default=0
    )

    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    teacher = db.relationship(
        "User",
        backref="courses"
    )

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    learner_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    course_id = db.Column(
        db.Integer,
        db.ForeignKey("course.id"),
        nullable=False
    )

    enrolled_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    learner = db.relationship(
        "User",
        backref="enrollments"
    )

    course = db.relationship(
        "Course",
        backref="enrollments"
    )

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    course_id = db.Column(
        db.Integer,
        db.ForeignKey("course.id"),
        nullable=False
    )

    lesson_id = db.Column(
        db.Integer,
        db.ForeignKey("lesson.id"),
        nullable=True
    )

    teacher_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    title = db.Column(db.String(150), nullable=False)
    instructions = db.Column(db.Text, nullable=False)

    due_date = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    course = db.relationship("Course", backref="assignments")
    lesson = db.relationship("Lesson", backref="assignments")
    teacher = db.relationship("User", backref="assignments")

class AssignmentSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    assignment_id = db.Column(
        db.Integer,
        db.ForeignKey("assignment.id"),
        nullable=False
    )

    learner_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    answer_text = db.Column(db.Text, nullable=True)
    file_url = db.Column(db.Text, nullable=True)

    status = db.Column(
        db.String(30),
        default="submitted"
    )

    mark = db.Column(db.Float, nullable=True)
    feedback = db.Column(db.Text, nullable=True)

    submitted_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    assignment = db.relationship(
        "Assignment",
        backref="submissions"
    )

    learner = db.relationship(
        "User",
        backref="assignment_submissions"
    )

#===========================
# HOME ROUTE 
#===========================
@app.route("/")
def home():
    return {
        "message": "LearnovaHub backend is running with PostgreSQL"
    }

#===========================
# AUTH ROUTES 
#===========================
@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    password = data.get("password", "")

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters long"
        }), 400

    if not re.search(r"[A-Z]", password):
        return jsonify({
            "error": "Password must include at least one uppercase letter"
        }), 400

    if not re.search(r"[a-z]", password):
        return jsonify({
            "error": "Password must include at least one lowercase letter"
        }), 400

    if not re.search(r"\d", password):
        return jsonify({
            "error": "Password must include at least one number"
        }), 400

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return jsonify({
            "error": "Password must include at least one special character"
        }), 400

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "error": "Email already exists"
        }), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    new_user = User(
        full_name=full_name,
        email=email,
        password=hashed_password.decode("utf-8")
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    password_is_valid = bcrypt.checkpw(
        password.encode("utf-8"),
        user.password.encode("utf-8")
    )

    if not password_is_valid:
        return jsonify({
            "error": "Invalid email or password"
        }), 401
    
    if (
        user.subscription_expires_at
        and user.subscription_expires_at < datetime.utcnow()
    ):
        user.is_subscribed = False
        user.subscription_type = None
        user.subscription_expires_at = None

        db.session.commit()

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_subscribed": user.is_subscribed,
            "subscription_type": user.subscription_type,
            "profile_pic_url": user.profile_pic_url, 
            "subscription_expires_at": user.subscription_expires_at.isoformat()
            if user.subscription_expires_at else None
        }
    }), 200

@app.route("/profile-picture", methods=["POST"])
@jwt_required()
def upload_profile_picture():

    user_id = int(get_jwt_identity())

    user = User.query.get_or_404(user_id)

    if "profile_picture" not in request.files:
        return jsonify({
            "error": "No profile picture uploaded"
        }), 400

    image = request.files["profile_picture"]

    upload_result = cloudinary.uploader.upload(
        image,
        folder="learnovahub/profile_pictures"
    )

    user.profile_pic_url = upload_result.get("secure_url")

    db.session.commit()

    return jsonify({
        "message": "Profile picture uploaded successfully",
        "profile_pic_url": user.profile_pic_url
    }), 200

#===========================
# LESSON ROUTES 
#===========================
@app.route("/lessons", methods=["GET"])
def get_lessons():

    lessons = Lesson.query.all()

    lesson_list = []

    for lesson in lessons:
        lesson_list.append({
            "id": lesson.id,
            "title": lesson.title,
            "topic": lesson.topic,
            "description": lesson.description,
            "video_url": lesson.video_url,
            "worksheet_url": lesson.worksheet_url,
            "is_premium": lesson.is_premium,
            "teacher_name": (
                lesson.teacher.full_name
                if lesson.teacher
                else "Admin"
            )
        })

    return jsonify(lesson_list), 200

@app.route("/lessons/<int:id>", methods=["GET"])
@jwt_required()
def get_lesson(id):

    lesson = Lesson.query.get_or_404(id)

    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    if user.role == "learner" and lesson.course_id:

        enrollment = Enrollment.query.filter_by(
            learner_id=user_id,
            course_id=lesson.course_id
        ).first()

        if not enrollment:
            return jsonify({
                "error": "You must enroll in this course before accessing this lesson"
            }), 403

    return jsonify({
        "id": lesson.id,
        "title": lesson.title,
        "topic": lesson.topic,
        "description": lesson.description,
        "video_url": lesson.video_url,
        "worksheet_url": lesson.worksheet_url,
        "is_premium": lesson.is_premium,
        "course_id": lesson.course_id,

        "course_title": (
            lesson.course.title
            if lesson.course
            else None
        ),
        "teacher_name": (
            lesson.teacher.full_name
            if lesson.teacher
            else "Admin"
        ),
    }), 200

@app.route("/lessons/<int:lesson_id>/quiz", methods=["GET"])
@jwt_required()
def get_quiz_questions(lesson_id):

    lesson = Lesson.query.get_or_404(lesson_id)

    user_id = int(get_jwt_identity())

    user = User.query.get_or_404(user_id)

    if user.role == "learner" and lesson.course_id:

        enrollment = Enrollment.query.filter_by(
            learner_id=user_id,
            course_id=lesson.course_id
        ).first()

        if not enrollment:
            return jsonify({
                "error": "You must enroll in this course before accessing this quiz"
            }), 403

    questions = QuizQuestion.query.filter_by(
        lesson_id=lesson_id
    ).all()

    quiz_data = []

    for question in questions:
        quiz_data.append({
            "id": question.id,
            "question": question.question,
            "option_a": question.option_a,
            "option_b": question.option_b,
            "option_c": question.option_c,
            "option_d": question.option_d,
            "correct_answer": question.correct_answer
        })

    return jsonify(quiz_data), 200

@app.route("/lessons/<int:lesson_id>/complete", methods=["POST"])
@jwt_required()
def mark_lesson_complete(lesson_id):

    lesson = Lesson.query.get_or_404(lesson_id)

    user_id = int(get_jwt_identity())

    user = User.query.get_or_404(user_id)

    if user.role == "learner" and lesson.course_id:

        enrollment = Enrollment.query.filter_by(
            learner_id=user_id,
            course_id=lesson.course_id
        ).first()

        if not enrollment:
            return jsonify({
                "error": "You must enroll in this course before completing this lesson"
            }), 403

    existing_completion = LessonCompletion.query.filter_by(
        user_id=user_id,
        lesson_id=lesson_id
    ).first()

    if existing_completion:
        return jsonify({
            "message": "Lesson already completed"
        }), 200

    completion = LessonCompletion(
        user_id=user_id,
        lesson_id=lesson_id
    )

    db.session.add(completion)
    db.session.commit()

    return jsonify({
        "message": "Lesson marked as complete"
    }), 201

#===========================
# QUIZ / MASTERY ROUTES 
#===========================
@app.route("/quiz-results", methods=["POST"])
@jwt_required()
def save_quiz_result():

    user_id = get_jwt_identity()
    data = request.get_json()

    result = QuizResult(
        user_id=user_id,
        lesson_id=data.get("lesson_id"),
        score=data.get("score"),
        total_questions=data.get("total_questions")
    )

    db.session.add(result)
    db.session.commit()

    return jsonify({
        "message": "Quiz result saved successfully"
    }), 201

@app.route("/my-quiz-results", methods=["GET"])
@jwt_required()
def get_my_quiz_results():

    user_id = get_jwt_identity()

    results = QuizResult.query.filter_by(
        user_id=user_id
    ).all()

    result_list = []

    for result in results:
        result_list.append({
            "id": result.id,
            "lesson_id": result.lesson_id,
            "lesson_title": result.lesson.title,
            "score": result.score,
            "total_questions": result.total_questions
        })

    return jsonify(result_list), 200

@app.route("/my-mastery", methods=["GET"])
@jwt_required()
def get_my_mastery():

    user_id = get_jwt_identity()

    results = QuizResult.query.filter_by(
        user_id=user_id
    ).all()

    best_mastery = {}

    for result in results:

        percentage = round(
            (result.score / result.total_questions) * 100
        )

        if percentage >= 75:
            mastery = "Mastered"
        elif percentage >= 50:
            mastery = "Developing"
        else:
            mastery = "Needs Improvement"

        if (
            result.lesson_id not in best_mastery
            or percentage > best_mastery[result.lesson_id]["percentage"]
        ):
            best_mastery[result.lesson_id] = {
                "lesson_title": result.lesson.title,
                "percentage": percentage,
                "mastery": mastery
            }

    return jsonify(list(best_mastery.values())), 200

@app.route("/my-best-scores", methods=["GET"])
@jwt_required()
def get_my_best_scores():

    user_id = get_jwt_identity()

    results = QuizResult.query.filter_by(
        user_id=user_id
    ).all()

    best_scores = {}

    for result in results:
        lesson_id = result.lesson_id

        percentage = round(
            (result.score / result.total_questions) * 100
        )

        if (
            lesson_id not in best_scores
            or percentage > best_scores[lesson_id]["percentage"]
        ):
            best_scores[lesson_id] = {
                "lesson_title": result.lesson.title,
                "score": result.score,
                "total_questions": result.total_questions,
                "percentage": percentage
            }

    return jsonify(list(best_scores.values())), 200

@app.route("/my-latest-scores", methods=["GET"])
@jwt_required()
def get_my_latest_scores():

    user_id = get_jwt_identity()

    results = QuizResult.query.filter_by(
        user_id=user_id
    ).order_by(
        QuizResult.id.desc()
    ).all()

    latest_scores = {}
    seen_lessons = set()

    for result in results:

        if result.lesson_id not in seen_lessons:

            percentage = round(
                (result.score / result.total_questions) * 100
            )

            latest_scores[result.lesson_id] = {
                "lesson_title": result.lesson.title,
                "score": result.score,
                "total_questions": result.total_questions,
                "percentage": percentage
            }

            seen_lessons.add(result.lesson_id)

    return jsonify(
        list(latest_scores.values())
    ), 200

#===========================
# PROGRESS ROUTES 
#===========================
@app.route("/my-progress", methods=["GET"])
@jwt_required()
def get_my_progress():

    user_id = get_jwt_identity()

    total_lessons = Lesson.query.count()

    completed_lessons = LessonCompletion.query.filter_by(
        user_id=user_id
    ).count()

    completion_percentage = 0

    if total_lessons > 0:
        completion_percentage = round(
            (completed_lessons / total_lessons) * 100
        )

    return jsonify({
        "total_lessons": total_lessons,
        "completed_lessons": completed_lessons,
        "completion_percentage": completion_percentage
    }), 200

@app.route("/completed-lessons", methods=["GET"])
@jwt_required()
def get_completed_lessons():

    user_id = get_jwt_identity()

    completions = LessonCompletion.query.filter_by(
        user_id=user_id
    ).all()

    completed_ids = [
        completion.lesson_id
        for completion in completions
    ]

    return jsonify(completed_ids), 200

#===========================
# PAYMENT ROUTES 
#===========================
@app.route("/payments/create", methods=["POST"])
@jwt_required()
def create_payment():

    user_id = get_jwt_identity()
    data = request.get_json()

    amount = data.get("amount")
    subscription_type = data.get("subscription_type")

    payment = Payment(
        user_id=user_id,
        amount=amount,
        subscription_type=subscription_type,
        status="pending"
    )

    db.session.add(payment)
    db.session.commit()

    return jsonify({
        "message": "Payment created successfully",
        "payment_id": payment.id
    }), 201

@app.route("/payments/payfast-data", methods=["POST"])
@jwt_required()
def create_payfast_data():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    data = request.get_json()
    amount = data.get("amount", 149)
    subscription_type = data.get("subscription_type", "monthly")
    course_id = data.get("course_id")

    payment = Payment(
        user_id=user_id,
        amount=amount,
        subscription_type=subscription_type,
        status="pending",
        course_id=course_id
    )

    db.session.add(payment)
    db.session.commit()

    payfast_data = {
        "merchant_id": os.getenv("PAYFAST_MERCHANT_ID"),
        "merchant_key": os.getenv("PAYFAST_MERCHANT_KEY"),
        "return_url": f"{os.getenv('FRONTEND_URL')}/payment-success",
        "cancel_url": f"{os.getenv('FRONTEND_URL')}/payment-cancelled",
        "notify_url": f"{os.getenv('BACKEND_URL')}/payments/notify",
        "name_first": user.full_name.split()[0],
        "email_address": user.email,
        "m_payment_id": str(payment.id),
        "amount": f"{amount:.2f}",
        "item_name": "LearnovaHub Monthly Subscription",
    }

    signature_fields = [
        "merchant_id",
        "merchant_key",
        "return_url",
        "cancel_url",
        "notify_url",
        "name_first",
        "email_address",
        "m_payment_id",
        "amount",
        "item_name",
    ]

    signature_parts = []

    for field in signature_fields:
        value = payfast_data.get(field)

        if value:
            signature_parts.append(
                f"{field}={quote_plus(str(value))}"
            )

    signature_string = "&".join(signature_parts)

    signature = hashlib.md5(
        signature_string.encode("utf-8")
    ).hexdigest()

    #payfast_data["signature"] = signature

    return jsonify({
        "payfast_url": os.getenv("PAYFAST_URL"),
        "payfast_data": payfast_data
    }), 200

@app.route("/payments/notify", methods=["POST"])
def payfast_notify():

    data = request.form.to_dict()

    payment_id = data.get("m_payment_id")
    payment_status = data.get("payment_status")

    payment = Payment.query.get(payment_id)

    if not payment:
        return "Payment not found", 404

    if payment_status == "COMPLETE":
        payment.status = "paid"

        user = User.query.get(payment.user_id)

        user.is_subscribed = True
        user.subscription_type = payment.subscription_type
        user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)

        if payment.course_id:
            existing_enrollment = Enrollment.query.filter_by(
                learner_id=payment.user_id,
                course_id=payment.course_id
            ).first()

            if not existing_enrollment:
                enrollment = Enrollment(
                    learner_id=payment.user_id,
                    course_id=payment.course_id
                )

                db.session.add(enrollment)

        db.session.commit()

    return "OK", 200

#===========================
# NOTIFICATION ROUTES 
#===========================
@app.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():

    user_id = int(get_jwt_identity())

    user = User.query.get_or_404(user_id)

    notifications = Notification.query.filter(
        db.or_(
            Notification.target_role == "all",
            Notification.target_role == user.role
        )
    ).order_by(
        Notification.created_at.desc()
    ).all()

    notification_list = []

    for notification in notifications:
        notification_list.append({
            "id": notification.id,
            "title": notification.title,
            "message": notification.message,
            "link": notification.link,
            "target_role": notification.target_role,
            "created_at": notification.created_at.isoformat()
        })

    return jsonify(notification_list), 200

@app.route("/admin/notifications", methods=["POST"])
def create_notification():

    data = request.get_json()

    notification = Notification(
        title=data.get("title"),
        message=data.get("message"),
        link=data.get("link"),
        target_role=data.get("target_role", "all")
    )

    db.session.add(notification)
    db.session.commit()

    return jsonify({
        "message": "Notification created successfully"
    }), 201

#===========================
# ADMIN ROUTES 
#===========================
@app.route("/admin/analytics", methods=["GET"])
@jwt_required()
def admin_analytics():

    total_users = User.query.count()

    active_subscribers = User.query.filter_by(
        is_subscribed=True
    ).count()

    total_learners = User.query.filter_by(
        role="learner"
    ).count()

    total_admins = User.query.filter_by(
        role="admin"
    ).count()

    total_lessons = Lesson.query.count()
    total_quiz_attempts = QuizResult.query.count()
    all_results = QuizResult.query.all()

    average_score = 0

    if all_results:
        total_percentages = 0
        for result in all_results:
            percentage = (
                result.score / result.total_questions
            ) * 100
            total_percentages += percentage
        average_score = round(
            total_percentages / len(all_results)
        )

    total_payments = Payment.query.count()

    successful_payments = Payment.query.filter_by(
        status="completed"
    ).count()

    return jsonify({
        "total_users": total_users,
        "total_learners": total_learners,
        "total_admins": total_admins,
        "active_subscribers": active_subscribers,
        "total_lessons": total_lessons,
        "total_quiz_attempts": total_quiz_attempts,
        "average_score": average_score,
        "total_payments": total_payments,
        "successful_payments": successful_payments
    }), 200

@app.route("/admin/users", methods=["GET"])
def get_users():

    users = User.query.all()

    user_list = []

    for user in users:
        user_list.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_subscribed": user.is_subscribed,
            "subscription_type": user.subscription_type
        })

    return jsonify(user_list), 200

@app.route("/admin/users/<int:user_id>/subscription", methods=["PATCH"])
@jwt_required()
@admin_required
def update_subscription(user_id):

    data = request.get_json()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    is_subscribed = data.get("is_subscribed", user.is_subscribed)

    user.is_subscribed = is_subscribed
    user.subscription_type = data.get("subscription_type")

    if is_subscribed:
        user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)
    else:
        user.subscription_expires_at = None

    db.session.commit()

    return jsonify({
        "message": "Subscription updated successfully"
    }), 200

@app.route("/admin/users/<int:user_id>/role", methods=["PATCH"])
@jwt_required()
@admin_required
def update_user_role(user_id):

    user = User.query.get_or_404(user_id)

    data = request.get_json()

    user.role = data.get("role", user.role)

    db.session.commit()

    return jsonify({
        "message": "User role updated successfully",
        "role": user.role
    }), 200

@app.route("/admin/learners", methods=["GET"])
@jwt_required()
def get_all_learners():

    learners = User.query.filter_by(
        role="learner"
    ).all()

    learner_data = []

    for learner in learners:

        completed_lessons = LessonCompletion.query.filter_by(
            user_id=learner.id
        ).count()

        total_lessons = Lesson.query.count()

        progress = 0

        if total_lessons > 0:
            progress = round(
                (completed_lessons / total_lessons) * 100
            )

        learner_data.append({
            "id": learner.id,
            "full_name": learner.full_name,
            "email": learner.email,
            "role": learner.role,
            "is_subscribed": learner.is_subscribed,
            "progress": progress
        })

    return jsonify(learner_data), 200

@app.route("/admin/learners/<int:learner_id>", methods=["GET"])
@jwt_required()
@admin_required
def get_learner_detail(learner_id):

    learner = User.query.get_or_404(learner_id)

    completed_lessons = LessonCompletion.query.filter_by(
        user_id=learner.id
    ).count()

    total_lessons = Lesson.query.count()

    progress = 0

    if total_lessons > 0:
        progress = round(
            (completed_lessons / total_lessons) * 100
        )

    quizzes_passed = QuizResult.query.filter(
        QuizResult.user_id == learner.id,
        QuizResult.score >= (
            QuizResult.total_questions * 0.5
        )
    ).count()

    return jsonify({
        "id": learner.id,
        "full_name": learner.full_name,
        "email": learner.email,
        "is_subscribed": learner.is_subscribed,
        "progress": progress,
        "lessons_completed": completed_lessons,
        "quizzes_passed": quizzes_passed,
    })

@app.route("/admin/lessons", methods=["POST"])
@jwt_required()
@admin_required
def create_lesson():

    data = request.get_json()

    new_lesson = Lesson(
        title=data.get("title"),
        topic=data.get("topic"),
        description=data.get("description"),
        video_url=data.get("video_url"),
        worksheet_url=data.get("worksheet_url"),
        is_premium=data.get("is_premium", True)
    )

    db.session.add(new_lesson)
    db.session.commit()

    return jsonify({
        "message": "Lesson created successfully"
    }), 201

@app.route("/admin/lessons/<int:lesson_id>", methods=["PATCH"])
@jwt_required()
@admin_required
def update_lesson(lesson_id):

    lesson = Lesson.query.get_or_404(lesson_id)
    data = request.get_json()

    lesson.title = data.get("title", lesson.title)
    lesson.topic = data.get("topic", lesson.topic)
    lesson.description = data.get("description", lesson.description)
    lesson.video_url = data.get("video_url", lesson.video_url)
    lesson.worksheet_url = data.get("worksheet_url", lesson.worksheet_url)
    lesson.is_premium = data.get("is_premium", lesson.is_premium)

    db.session.commit()

    return jsonify({
        "message": "Lesson updated successfully"
    }), 200

@app.route("/admin/lessons/<int:lesson_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_lesson(lesson_id):

    lesson = Lesson.query.get_or_404(lesson_id)

    db.session.delete(lesson)
    db.session.commit()

    return jsonify({
        "message": "Lesson deleted successfully"
    }), 200

# =========================
# TEACHER ROUTES
# =========================
@app.route("/teacher/lessons", methods=["GET"])
@jwt_required()
def get_teacher_lessons():

    teacher_id = int(get_jwt_identity())

    lessons = Lesson.query.filter_by(
        teacher_id=teacher_id
    ).all()

    lesson_list = []

    for lesson in lessons:
        quiz_count = QuizQuestion.query.filter_by(
            lesson_id=lesson.id
        ).count()
        lesson_list.append({
            "id": lesson.id,
            "title": lesson.title,
            "topic": lesson.topic,
            "description": lesson.description,
            "video_url": lesson.video_url,
            "worksheet_url": lesson.worksheet_url,
            "is_premium": lesson.is_premium,
            "teacher_id": lesson.teacher_id,
            "course_id": lesson.course_id,

            "course_title": (
                lesson.course.title
                if lesson.course
                else "Unassigned"
            ),

            "quiz_question_count": quiz_count,

            "teacher_name": (
                lesson.teacher.full_name
                if lesson.teacher
                else "Admin"
            ),
        })

    return jsonify(lesson_list), 200

@app.route("/teacher/lessons", methods=["POST"])
@jwt_required()
def create_teacher_lesson():

    teacher_id = int(get_jwt_identity())

    user = User.query.get_or_404(teacher_id)

    if user.role != "teacher":
        return jsonify({
            "error": "Teacher access required"
        }), 403

    data = request.get_json()

    lesson = Lesson(
        title=data.get("title"),
        topic=data.get("topic"),
        description=data.get("description"),
        video_url=data.get("video_url"),
        worksheet_url=data.get("worksheet_url"),
        is_premium=data.get("is_premium", True),
        teacher_id=teacher_id,
        course_id=data.get("course_id"),
        
    )

    db.session.add(lesson)
    db.session.commit()

    return jsonify({
        "message": "Teacher lesson created successfully"
    }), 201

@app.route("/teacher/lessons/<int:lesson_id>", methods=["PATCH"])
@jwt_required()
def update_teacher_lesson(lesson_id):

    teacher_id = int(get_jwt_identity())

    lesson = Lesson.query.get_or_404(lesson_id)

    if lesson.teacher_id != teacher_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    data = request.get_json()

    lesson.title = data.get("title", lesson.title)
    lesson.topic = data.get("topic", lesson.topic)
    lesson.description = data.get("description", lesson.description)
    lesson.video_url = data.get("video_url", lesson.video_url)
    lesson.worksheet_url = data.get(
        "worksheet_url",
        lesson.worksheet_url
    )
    lesson.is_premium = data.get(
        "is_premium",
        lesson.is_premium
    )
    lesson.course_id = data.get(
        "course_id",
        lesson.course_id
    )

    db.session.commit()

    return jsonify({
        "message": "Lesson updated successfully"
    }), 200

@app.route("/teacher/lessons/<int:lesson_id>", methods=["DELETE"])
@jwt_required()
def delete_teacher_lesson(lesson_id):

    teacher_id = int(get_jwt_identity())

    lesson = Lesson.query.get_or_404(lesson_id)

    if lesson.teacher_id != teacher_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    db.session.delete(lesson)

    db.session.commit()

    return jsonify({
        "message": "Lesson deleted successfully"
    }), 200

@app.route("/teacher/analytics", methods=["GET"])
@jwt_required()
def teacher_analytics():

    teacher_id = int(get_jwt_identity())

    user = User.query.get_or_404(teacher_id)

    if user.role != "teacher":
        return jsonify({
            "error": "Teacher access required"
        }), 403

    total_lessons = Lesson.query.filter_by(
        teacher_id=teacher_id
    ).count()

    premium_lessons = Lesson.query.filter_by(
        teacher_id=teacher_id,
        is_premium=True
    ).count()

    free_lessons = Lesson.query.filter_by(
        teacher_id=teacher_id,
        is_premium=False
    ).count()

    teacher_lessons = Lesson.query.filter_by(
        teacher_id=teacher_id
    ).all()

    lesson_ids = [
        lesson.id
        for lesson in teacher_lessons
    ]

    total_quiz_questions = QuizQuestion.query.filter(
        QuizQuestion.lesson_id.in_(lesson_ids)
    ).count() if lesson_ids else 0

    lessons_with_quizzes = 0

    for lesson in teacher_lessons:
        quiz_count = QuizQuestion.query.filter_by(
            lesson_id=lesson.id
        ).count()

        if quiz_count > 0:
            lessons_with_quizzes += 1

    lessons_without_quizzes = (
        total_lessons - lessons_with_quizzes
    )

    return jsonify({
        "total_lessons": total_lessons,
        "premium_lessons": premium_lessons,
        "free_lessons": free_lessons,
        "total_quiz_questions": total_quiz_questions,
        "lessons_with_quizzes": lessons_with_quizzes,
        "lessons_without_quizzes": lessons_without_quizzes
    }), 200

@app.route("/teacher/lessons/<int:lesson_id>/quiz", methods=["GET"])
@jwt_required()
def get_teacher_quiz_questions(lesson_id):

    teacher_id = int(get_jwt_identity())

    lesson = Lesson.query.get_or_404(lesson_id)

    if lesson.teacher_id != teacher_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    questions = QuizQuestion.query.filter_by(
        lesson_id=lesson_id
    ).all()

    question_list = []

    for question in questions:

        question_list.append({
            "id": question.id,
            "question": question.question,
            "option_a": question.option_a,
            "option_b": question.option_b,
            "option_c": question.option_c,
            "option_d": question.option_d,
            "correct_answer": question.correct_answer
        })

    return jsonify(question_list), 200

@app.route("/teacher/lessons/<int:lesson_id>/quiz", methods=["POST"])
@jwt_required()
def create_teacher_quiz_question(lesson_id):

    teacher_id = int(get_jwt_identity())

    lesson = Lesson.query.get_or_404(lesson_id)

    if lesson.teacher_id != teacher_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    data = request.get_json()

    question = QuizQuestion(
        lesson_id=lesson_id,
        question=data.get("question"),
        option_a=data.get("option_a"),
        option_b=data.get("option_b"),
        option_c=data.get("option_c"),
        option_d=data.get("option_d"),
        correct_answer=data.get("correct_answer")
    )

    db.session.add(question)
    db.session.commit()

    return jsonify({
        "message": "Quiz question created successfully"
    }), 201

@app.route("/teacher/quiz-questions/<int:question_id>", methods=["DELETE"])
@jwt_required()
def delete_teacher_quiz_question(question_id):

    teacher_id = int(get_jwt_identity())

    question = QuizQuestion.query.get_or_404(question_id)

    if question.lesson.teacher_id != teacher_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    db.session.delete(question)
    db.session.commit()

    return jsonify({
        "message": "Quiz question deleted successfully"
    }), 200

@app.route("/teacher/quiz-questions/<int:question_id>", methods=["PATCH"])
@jwt_required()
def update_teacher_quiz_question(question_id):

    teacher_id = int(get_jwt_identity())
    question = QuizQuestion.query.get_or_404(question_id)
    if question.lesson.teacher_id != teacher_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    data = request.get_json()
    question.question = data.get(
        "question",
        question.question
    )

    question.option_a = data.get(
        "option_a",
        question.option_a
    )

    question.option_b = data.get(
        "option_b",
        question.option_b
    )

    question.option_c = data.get(
        "option_c",
        question.option_c
    )

    question.option_d = data.get(
        "option_d",
        question.option_d
    )

    question.correct_answer = data.get(
        "correct_answer",
        question.correct_answer
    )

    db.session.commit()

    return jsonify({
        "message": "Quiz question updated successfully"
    }), 200

@app.route("/teacher/courses", methods=["GET"])
@jwt_required()
def get_teacher_courses():

    teacher_id = int(get_jwt_identity())

    courses = Course.query.filter_by(
        teacher_id=teacher_id
    ).all()

    course_list = []

    for course in courses:
        lesson_count = Lesson.query.filter_by(
            course_id=course.id
        ).count()
        course_list.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "learning_outcomes": course.learning_outcomes,
            "price": course.price,
            "teacher_id": course.teacher_id,
            "lesson_count": lesson_count,
            "created_at": (
                course.created_at.isoformat()
                if course.created_at
                else None
            )
        })

    return jsonify(course_list), 200

@app.route("/teacher/courses", methods=["POST"])
@jwt_required()
def create_teacher_course():

    teacher_id = int(get_jwt_identity())

    user = User.query.get_or_404(teacher_id)

    if user.role != "teacher":
        return jsonify({
            "error": "Teacher access required"
        }), 403

    data = request.get_json()

    course = Course(
        title=data.get("title"),
        description=data.get("description"),
        learning_outcomes=data.get("learning_outcomes", ""),
        price=data.get("price", 0),
        teacher_id=teacher_id
    )

    db.session.add(course)
    db.session.commit()

    return jsonify({
        "message": "Course created successfully"
    }), 201

@app.route("/teacher/courses/<int:course_id>", methods=["PATCH"])
@jwt_required()
def update_teacher_course(course_id):

    teacher_id = int(get_jwt_identity())

    course = Course.query.get_or_404(course_id)

    if course.teacher_id != teacher_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    data = request.get_json()

    course.title = data.get("title", course.title)
    course.description = data.get(
        "description",
        course.description
    )
    course.learning_outcomes = data.get(
        "learning_outcomes",
        course.learning_outcomes
    )
    course.price = data.get("price", course.price)

    db.session.commit()

    return jsonify({
        "message": "Course updated successfully"
    }), 200

@app.route("/teacher/courses/<int:course_id>", methods=["DELETE"])
@jwt_required()
def delete_teacher_course(course_id):

    teacher_id = int(get_jwt_identity())

    course = Course.query.get_or_404(course_id)

    if course.teacher_id != teacher_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    linked_lessons = Lesson.query.filter_by(
        course_id=course.id
    ).count()

    if linked_lessons > 0:
        return jsonify({
            "error": "Cannot delete course with linked lessons"
        }), 400

    db.session.delete(course)
    db.session.commit()

    return jsonify({
        "message": "Course deleted successfully"
    }), 200

@app.route("/teacher/learners", methods=["GET"])
@jwt_required()
def get_teacher_learners():

    teacher_id = int(get_jwt_identity())

    user = User.query.get_or_404(teacher_id)

    if user.role != "teacher":
        return jsonify({
            "error": "Teacher access required"
        }), 403

    teacher_courses = Course.query.filter_by(
        teacher_id=teacher_id
    ).all()

    course_ids = [
        course.id
        for course in teacher_courses
    ]

    enrollments = Enrollment.query.filter(
        Enrollment.course_id.in_(course_ids)
    ).all() if course_ids else []

    learner_map = {}

    for enrollment in enrollments:

        learner = enrollment.learner
        course = enrollment.course

        if learner.id not in learner_map:
            learner_map[learner.id] = {
                "id": learner.id,
                "full_name": learner.full_name,
                "email": learner.email,
                "courses": []
            }

        learner_map[learner.id]["courses"].append({
            "id": course.id,
            "title": course.title,
            "enrolled_at": (
                enrollment.enrolled_at.isoformat()
                if enrollment.enrolled_at
                else None
            )
        })

    return jsonify(
        list(learner_map.values())
    ), 200

@app.route("/teacher/learners/<int:learner_id>", methods=["GET"])
@jwt_required()
def get_teacher_learner_detail(learner_id):

    teacher_id = int(get_jwt_identity())

    teacher = User.query.get_or_404(teacher_id)

    if teacher.role != "teacher":
        return jsonify({
            "error": "Teacher access required"
        }), 403

    learner = User.query.get_or_404(learner_id)

    teacher_courses = Course.query.filter_by(
        teacher_id=teacher_id
    ).all()

    teacher_course_ids = [
        course.id
        for course in teacher_courses
    ]

    enrollments = Enrollment.query.filter(
        Enrollment.learner_id == learner_id,
        Enrollment.course_id.in_(teacher_course_ids)
    ).all()

    enrolled_courses = []

    for enrollment in enrollments:

        course = enrollment.course

        lessons = Lesson.query.filter_by(
            course_id=course.id
        ).all()

        total_lessons = len(lessons)

        completed_count = 0

        for lesson in lessons:

            completion = LessonCompletion.query.filter_by(
                user_id=learner_id,
                lesson_id=lesson.id
            ).first()

            if completion:
                completed_count += 1

        completion_percentage = (
            round(
                (completed_count / total_lessons) * 100
            )
            if total_lessons > 0
            else 0
        )

        enrolled_courses.append({
            "id": course.id,
            "title": course.title,
            "total_lessons": total_lessons,
            "completed_lessons": completed_count,
            "completion_percentage": completion_percentage
        })

    return jsonify({
        "id": learner.id,
        "full_name": learner.full_name,
        "email": learner.email,
        "courses": enrolled_courses,
        "profile_pic_url": learner.profile_pic_url
    }), 200


# =========================
# LEARNER ROUTES
# =========================
@app.route("/courses/<int:course_id>/enroll", methods=["POST"])
@jwt_required()
def enroll_course(course_id):

    learner_id = int(get_jwt_identity())

    user = User.query.get_or_404(learner_id)

    if user.role != "learner":
        return jsonify({
            "error": "Learner access required"
        }), 403

    course = Course.query.get_or_404(course_id)

    existing_enrollment = Enrollment.query.filter_by(
        learner_id=learner_id,
        course_id=course.id
    ).first()

    if existing_enrollment:
        return jsonify({
            "message": "Already enrolled"
        }), 200

    enrollment = Enrollment(
        learner_id=learner_id,
        course_id=course.id
    )

    db.session.add(enrollment)
    db.session.commit()

    return jsonify({
        "message": "Enrollment successful"
    }), 201

@app.route("/courses", methods=["GET"])
def get_courses():

    courses = Course.query.all()

    course_list = []

    for course in courses:

        lesson_count = Lesson.query.filter_by(
            course_id=course.id
        ).count()

        course_list.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "learning_outcomes": course.learning_outcomes,
            "price": course.price,
            "teacher_name": (
                course.teacher.full_name
                if course.teacher
                else "Unknown"
            ),
            "lesson_count": lesson_count
        })

    return jsonify(course_list), 200

@app.route("/courses/<int:course_id>", methods=["GET"])
def get_course_detail(course_id):

    course = Course.query.get_or_404(course_id)

    lessons = Lesson.query.filter_by(
        course_id=course.id
    ).all()

    lesson_list = []

    for lesson in lessons:
        lesson_list.append({
            "id": lesson.id,
            "title": lesson.title,
            "topic": lesson.topic,
            "description": lesson.description,
            "video_url": lesson.video_url,
            "worksheet_url": lesson.worksheet_url,
            "is_premium": lesson.is_premium
        })

    return jsonify({
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "learning_outcomes": course.learning_outcomes,
        "price": course.price,
        "teacher_name": (
            course.teacher.full_name
            if course.teacher
            else "Unknown"
        ),
        "lessons": lesson_list
    }), 200

@app.route("/my-courses", methods=["GET"])
@jwt_required()
def get_my_courses():

    learner_id = int(get_jwt_identity())

    enrollments = Enrollment.query.filter_by(
        learner_id=learner_id
    ).all()

    course_list = []

    for enrollment in enrollments:

        course = enrollment.course

        lesson_count = Lesson.query.filter_by(
            course_id=course.id
        ).count()

        course_list.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "learning_outcomes": course.learning_outcomes,
            "price": course.price,

            "teacher_name": (
                course.teacher.full_name
                if course.teacher
                else "Unknown"
            ),

            "lesson_count": lesson_count,

            "enrolled_at": (
                enrollment.enrolled_at.isoformat()
                if enrollment.enrolled_at
                else None
            )
        })

    return jsonify(course_list), 200

# === DATABASE INITIALIZATION ===
with app.app_context():
    db.create_all()

# === SEED DATA ===
with app.app_context():

    if Lesson.query.count() == 0:

        lesson1 = Lesson(
            title="Algebra Basics",
            topic="Algebra",
            description="Introduction to algebraic expressions and equations.",
            video_url="https://www.youtube.com/watch?v=NybHckSEQBI",
            worksheet_url="#",
            is_premium=False
        )

        lesson2 = Lesson(
            title="Geometry and Angles",
            topic="Geometry",
            description="Understanding angles, lines, and geometric properties.",
            video_url="https://www.youtube.com/watch?v=302eJ3TzJQU",
            worksheet_url="#",
            is_premium=True
        )

        lesson3 = Lesson(
            title="Functions and Graphs",
            topic="Functions",
            description="Learn how to interpret and draw graphs.",
            video_url="https://www.youtube.com/watch?v=kvgsnq7HqA0",
            worksheet_url="#",
            is_premium=True
        )

        db.session.add_all([
            lesson1,
            lesson2,
            lesson3
        ])

        db.session.commit()
    if QuizQuestion.query.count() == 0:

        question1 = QuizQuestion(
            lesson_id=1,
            question="What is the value of x in 2x + 4 = 10?",
            option_a="2",
            option_b="3",
            option_c="4",
            option_d="5",
            correct_answer="B"
        )

        question2 = QuizQuestion(
            lesson_id=1,
            question="Simplify: 3a + 2a",
            option_a="5",
            option_b="6a",
            option_c="5a",
            option_d="a",
            correct_answer="C"
        )

        question3 = QuizQuestion(
            lesson_id=2,
            question="Angles on a straight line add up to?",
            option_a="90°",
            option_b="180°",
            option_c="360°",
            option_d="45°",
            correct_answer="B"
        )

        db.session.add_all([
            question1,
            question2,
            question3
        ])

        db.session.commit()

# === RUN APP ===
if __name__ == "__main__":
    app.run(debug=True)