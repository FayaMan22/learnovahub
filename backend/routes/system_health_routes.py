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
        "message": "LearnovaHub backend is responding.",
        "response_time_ms": 0
    })

    database_start = perf_counter()

    try:
        db.session.execute(db.text("SELECT 1"))

        database_response_time = round(
            (perf_counter() - database_start) * 1000,
            2
        )

        checks.append({
            "id": "database",
            "service": "Database",
            "check_type": "connectivity",
            "status": "pass",
            "message": "Database connection successful.",
            "response_time_ms": database_response_time
        })

    except Exception:
        current_app.logger.exception(
            "Database system-health check failed."
        )

        database_response_time = round(
            (perf_counter() - database_start) * 1000,
            2
        )

        checks.append({
            "id": "database",
            "service": "Database",
            "check_type": "connectivity",
            "status": "fail",
            "message": "Database connection failed.",
            "response_time_ms": database_response_time
        })

        app.logger.exception(
            "System health database check failed"
        )

    cloudinary_ready = all([
        os.getenv("CLOUDINARY_CLOUD_NAME"),
        os.getenv("CLOUDINARY_API_KEY"),
        os.getenv("CLOUDINARY_API_SECRET"),
    ])
    if cloudinary_ready:
        checks.append({
            "id": "cloudinary",
            "service": "Cloudinary",
            "check_type": "configuration",
            "status": "pass",
            "message": "Cloudinary configuration is available.",
            "response_time_ms": None
        })
    else:
        checks.append({
            "id": "cloudinary",
            "service": "Cloudinary",
            "check_type": "configuration",
            "status": "warning",
            "message": "Cloudinary configuration is missing.",
            "response_time_ms": None
        })

    payfast_ready = all([
        os.getenv("PAYFAST_MERCHANT_ID"),
        os.getenv("PAYFAST_MERCHANT_KEY"),
        os.getenv("PAYFAST_URL"),
    ])

    if payfast_ready:
        checks.append({
            "id": "payfast",
            "service": "PayFast",
            "check_type": "configuration",
            "status": "pass",
            "message": "PayFast configuration is available.",
            "response_time_ms": None
        })
    else:
        checks.append({
            "id": "payfast",
            "service": "PayFast",
            "check_type": "configuration",
            "status": "warning",
            "message": "PayFast configuration is incomplete.",
            "response_time_ms": None
        })

    platform_urls_ready = all([
        os.getenv("FRONTEND_URL"),
        os.getenv("BACKEND_URL"),
    ])

    if platform_urls_ready:
        checks.append({
            "id": "platform_urls",
            "service": "Platform URLs",
            "check_type": "configuration",
            "status": "pass",
            "message": "Frontend and backend URLs are configured.",
            "response_time_ms": None
        })
    else:
        {
            "id": "platform_url",
            "service": "Platform URL",
            "check_type": "configuration",
            "status": "pass",
            "message": "Platform URL is configured.",
            "response_time_ms": None
        }

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