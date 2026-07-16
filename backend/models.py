from datetime import datetime

from extensions import db

# ---MODELS---#

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
    total_marks = db.Column(db.Float, nullable=True)

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