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

load_dotenv()

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

db = SQLAlchemy(app)
jwt = JWTManager(app)

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

    subscription_expires_at = db.Column(
        db.DateTime,
        nullable=True
    )

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)

    topic = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text, nullable=False)

    video_url = db.Column(db.String(255), nullable=True)

    worksheet_url = db.Column(db.String(255), nullable=True)

    is_premium = db.Column(db.Boolean, default=True)

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

@app.route("/")
def home():
    return {
        "message": "LearnovaHub backend is running with PostgreSQL"
    }

@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

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
            "subscription_expires_at": user.subscription_expires_at.isoformat()
            if user.subscription_expires_at else None
        }
    }), 200

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
            "is_premium": lesson.is_premium
        })

    return jsonify(lesson_list), 200

@app.route("/admin/lessons", methods=["POST"])
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

@app.route("/lessons/<int:id>", methods=["GET"])
def get_lesson(id):

    lesson = Lesson.query.get(id)

    if not lesson:
        return jsonify({
            "error": "Lesson not found"
        }), 404

    return jsonify({
        "id": lesson.id,
        "title": lesson.title,
        "topic": lesson.topic,
        "description": lesson.description,
        "video_url": lesson.video_url,
        "worksheet_url": lesson.worksheet_url,
        "is_premium": lesson.is_premium
    }), 200

@app.route("/lessons/<int:lesson_id>/quiz", methods=["GET"])
def get_quiz_questions(lesson_id):

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

    payment = Payment(
        user_id=user_id,
        amount=amount,
        subscription_type=subscription_type,
        status="pending"
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

@app.route("/admin/users/<int:user_id>/subscription", methods=["PATCH"])
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

        db.session.commit()

    return "OK", 200

@app.route("/notifications", methods=["GET"])
def get_notifications():

    notifications = Notification.query.order_by(
        Notification.created_at.desc()
    ).all()

    notification_list = []

    for notification in notifications:
        notification_list.append({
            "id": notification.id,
            "title": notification.title,
            "message": notification.message,
            "link": notification.link,
            "created_at": notification.created_at.isoformat()
        })

    return jsonify(notification_list), 200

@app.route("/admin/notifications", methods=["POST"])
def create_notification():

    data = request.get_json()

    notification = Notification(
        title=data.get("title"),
        message=data.get("message"),
        link=data.get("link")
    )

    db.session.add(notification)
    db.session.commit()

    return jsonify({
        "message": "Notification created successfully"
    }), 201

with app.app_context():
    db.create_all()

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


if __name__ == "__main__":
    app.run(debug=True)