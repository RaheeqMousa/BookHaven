import smtplib
import random
from datetime import datetime, timedelta
from email.message import EmailMessage
from dotenv import load_dotenv
from fastapi import HTTPException
import motor.motor_asyncio
import os
from backend.app.database import users, email_verification
from fastapi.concurrency import run_in_threadpool


load_dotenv()

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")


def generate_verification_code() -> str:
    """Generate a 6-digit verification code."""
    return str(random.randint(100000, 999999))


def _send_email_sync(message: EmailMessage):
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        smtp.send_message(message)


async def send_email(email: str, code: str, subject: str = "Verify your email", body: str = "") -> dict:
    message = EmailMessage()

    if body=="":  
        message.set_content(
            f"Your verification code is: {code}\nIt expires in 10 minutes."
        )
    message.set_content(body)
    message["Subject"] = subject
    message["To"] = email
    message["From"] = GMAIL_ADDRESS
    

    try:
        await run_in_threadpool(_send_email_sync, message)
        return {"message": "Verification email sent", "email": email}
    except Exception as e:
        print(f"[EMAIL DEV] Failed to send to {email}: {e}")
        return {
            "message": "Verification email (dev) - send failed",
            "email": email,
            "code": code,
        }


async def send_verification_code(email: str) -> dict:
    email = email.lower().strip()

    user = await users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    code = generate_verification_code()
    expiry = datetime.utcnow() + timedelta(minutes=10)

    await email_verification.update_one(
        {"user_id": user["_id"]},
        {"$set": {"token": code, "expires_at": expiry, "verified": False}},
        upsert=True,
    )

    return await send_email(
        email,
        code,
        subject="Please verify your email - BookHaven",
    )



async def verify_code(email: str, code: str) -> dict:
    email = email.lower().strip()

    user = await users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    verification = await email_verification.find_one({"user_id": user["_id"]})
    if not verification:
        raise HTTPException(status_code=404, detail="Verification not found")

    if verification.get("verified") or verification.get("token") == "USED":
        raise HTTPException(status_code=400, detail="Email already verified")

    if verification.get("token") != code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    if verification.get("expires_at") < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Verification code expired")

    await email_verification.update_one(
        {"user_id": user["_id"]},
        {"$set": {"verified": True, "token": "USED"}},
    )

    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {"is_email_verified": True}},
    )

    return {"message": "Email verified successfully"}
