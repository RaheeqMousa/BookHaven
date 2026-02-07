from dotenv import load_dotenv
from fastapi import HTTPException, status
from backend.app.database import users
import backend.app.services.email_verification as email_verification_services
import bcrypt
from datetime import datetime

load_dotenv()

# Helper function to safely hash passwords
def hash_password(password: str) -> str:
    # Truncate password to 72 bytes
    truncated = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(truncated, salt)
    return hashed.decode()

def verify_password(password: str, hashed: str) -> bool:
    truncated = password.encode("utf-8")[:72]
    return bcrypt.checkpw(truncated, hashed.encode())

async def create_user(username: str, password: str, email: str):
    # Check if email is already registered
    existing_email_user = await users.find_one({"email": email})
    if existing_email_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username is already taken
    existing_username_user = await users.find_one({"username": username})
    if existing_username_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Hash the password safely
    password_hash = hash_password(password)

    user_document = {
        "username": username,
        "password_hash": password_hash,
        "email": email,
        "created_at": datetime.utcnow(),
        "is_email_verified": False
    }

    result = await users.insert_one(user_document)

    # Optionally, send verification email here
    await email_verification_services.send_verification_code(email)

    return {
        "message": "A verification code has been sent to your email",
        "user_id": str(result.inserted_id)
    }

async def signin(email: str, password: str):
    user = await users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    if not user.get("is_email_verified", False):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not verified")
    
    return {
        "message": "User logged in successfully",
        "user_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }
