from fastapi import Depends, HTTPException
from backend.app.database import users
from bson import ObjectId
import secrets
from datetime import datetime, timedelta

def check_user_existence_by_email(email):
    user= users.find_one({"email":email})
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

async def check_user_existence_by_id(user_id):  
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="user id structure is not valid")
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    
    return user_object_id

def generate_share_token():
    return secrets.token_urlsafe(32)

def share_expiry(days: int = 7):
    return datetime.utcnow() + timedelta(days=days)