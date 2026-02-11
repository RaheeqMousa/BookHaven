from datetime import datetime, timedelta
import secrets
from dotenv import load_dotenv
from fastapi import HTTPException
from backend.app.database import password_resets,users
import backend.app.services.email_verification as email_service
import bcrypt
import os

load_dotenv()
frontend_url=os.getenv("FRONTEND_URL")


def hash_password(password: str) -> str:
    # Truncate password to 72 bytes
    truncated = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(truncated, salt)
    return hashed.decode()


def generate_token():
    return secrets.token_hex(32)

async def send_password_reset_email(email:str):
    email = email.lower().strip()
    user= await users.find_one({"email":email})
    if not user:
        raise HTTPException(status_code=404, detail="Email address is not found")

    token = generate_token()
    expiry = datetime.utcnow() + timedelta(minutes=10)

    await password_resets.update_one(
        {"user_id":user["_id"]},
        {"$set":{"token":token, "expires_at":expiry, "used":False}},
        upsert=True
    )

    reset_url = f"http://{frontend_url}/auth/reset-password?email={email}&code={token}"
    await email_service.send_email(
        email,
        code=token,  # you can pass token as "code"
        subject="Reset your password",
        body=f"Click the link to reset your password: {reset_url}"
    )

    return {"message": "Password reset email sent"}

async def reset_password(email:str, token:str, new_password:str):
    email = email.lower().strip()
    user= await users.find_one({"email":email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reset_record = await password_resets.find_one({
        "user_id": user["_id"],
        "token": token
    })

    if not reset_record:
        raise HTTPException(status_code=404, detail="Invalid or expired token")
    
    if reset_record.get("used") :
        raise HTTPException(status_code=400, detail="Token already used")
    if reset_record.get("expires_at") < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")
    
    pass_hash= hash_password(new_password)
    await users.update_one(
        {"_id":user["_id"]},
        {"$set":{"password_hash":pass_hash}}
    )

    await password_resets.update_one(
        {"user_id":user["_id"]},
        {"$set":{"used":True}}
    )

    return {"message": "Password has been reset successfully"}
    