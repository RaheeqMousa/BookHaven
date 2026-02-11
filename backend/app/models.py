from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class User(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password_hash:str
    created_at:datetime=Field(default_factory=datetime.utcnow)
    email: str
    is_email_verified: bool = False

class Signin(BaseModel):
    email: str
    password: str

class Signup(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=8, max_length=20)
    email: str

class ResetPass(BaseModel):
    email: str
    token: str
    new_password: str

class SendPassResetRequest(BaseModel):
    email: str

class Favorite(BaseModel):
    user_id: str
    item_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

# class VerifyCodeResponse(BaseModel):
#     message: str
#     email: EmailStr

class SendCodeRequest(BaseModel):
    email: EmailStr
    purpose: str

# class SendCodeResponse(BaseModel):
#     message: str
#     email: EmailStr
#     code: str

class EmailStrRequest(BaseModel):
    email: EmailStr

class FavoriteRequest(BaseModel):
    item_id: str

# class UserRequest(BaseModel):
#     user_id: int

class CartRequest(BaseModel):
    item_id: str

class FavoriteItemResponse(BaseModel):
    user_id: str
    item_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CartItemResponse(BaseModel):
    user_id: str
    item_id: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    quantity: int

class VerifyResetTokenRequest(BaseModel):
    email: str
    token: str