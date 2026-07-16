# system_health_routes.py
import os
from datetime import datetime, timezone
from time import perf_counter

from flask import Blueprint, current_app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import text

from extensions import db
from models import User

system_health_bp = Blueprint(
    "system_health",
    __name__
)

@system_health_bp.route(
    "/admin/system-health",
    methods=["GET"]
)
@jwt_required()
def get_system_health():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)

    if not user or user.role != "admin":
        return jsonify({
            "error": "Admin access required"
        }), 403
    
    checks = []

    checks.append({
        "id": "backend_api",
        "service": "Backend API",
        "check_type": "connectivity",
        "status": "pass",
        "message": "LearnovaHub backend is running.",
    })

    try:
        started_at = perf_counter()

        db.session.execute(text("SELECT 1")).scalar()

        response_time_ms = round(
            (perf_counter() - started_at) * 1000,
            2
        )

        if response_time_ms > 1000:
            database_status = "warning"
            database_message = "Database is responding slowly."
        else:
            database_status = "pass"
            database_message = "Database connection is working."

        checks.append({
            "id": "database",
            "service": "Database",
            "check_type": "connectivity",
            "status": database_status,
            "message": database_message,
            "response_time_ms": response_time_ms,
        })
    except Exception:
        db.session.rollback()

        checks.append({
            "id": "database",
            "service": "Database",
            "check_type": "connectivity",
            "status": "fail",
            "message": "Database connection failed.",
            "response_time_ms": None,
        })

        app.logger.exception(
            "System health database check failed"
        )

    cloudinary_ready = all([
        os.getenv("CLOUDINARY_CLOUD_NAME"),
        os.getenv("CLOUDINARY_API_KEY"),
        os.getenv("CLOUDINARY_API_SECRET"),
    ])

    checks.append({
        "id": "cloudinary",
        "service": "Cloudinary",
        "check_type": "configuration",
        "status": "pass" if cloudinary_ready else "warning",
        "message": (
            "Cloudinary configuration is available."
            if cloudinary_ready
            else "Cloudinary configuration is incomplete."
        ),
    })

    payfast_ready = all([
        os.getenv("PAYFAST_MERCHANT_ID"),
        os.getenv("PAYFAST_MERCHANT_KEY"),
        os.getenv("PAYFAST_URL"),
    ])

    checks.append({
        "id": "payfast",
        "service": "PayFast",
        "check_type": "configuration",
        "status": "pass" if payfast_ready else "warning",
        "message": (
            "PayFast configuration is available."
            if payfast_ready
            else "PayFast configuration is incomplete."
        ),
    })

    platform_urls_ready = all([
        os.getenv("FRONTEND_URL"),
        os.getenv("BACKEND_URL"),
    ])

    checks.append({
        "id": "platform_urls",
        "service": "Platform URLs",
        "check_type": "configuration",
        "status": "pass" if platform_urls_ready else "warning",
        "message": (
            "Frontend and backend URLs are configured."
            if platform_urls_ready
            else "Frontend or backend URL is missing."
        ),
    })

    passed_checks = sum(
        check["status"] == "pass"
        for check in checks
    )

    warning_checks = sum(
        check["status"] == "warning"
        for check in checks
    )

    failed_checks = sum(
        check["status"] == "fail"
        for check in checks
    )

    if failed_checks:
        overall_status = "fail"
    elif warning_checks:
        overall_status = "warning"
    else:
        overall_status = "pass"

    return jsonify({
        "overall_status": overall_status,
        "summary": {
            "total": len(checks),
            "passed": passed_checks,
            "warnings": warning_checks,
            "failed": failed_checks,
        },
        "checks": checks,
        "checked_at": datetime.now(
            timezone.utc
        ).isoformat(),
    }), 200