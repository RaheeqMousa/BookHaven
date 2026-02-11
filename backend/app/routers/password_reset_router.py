from fastapi import APIRouter
import backend.app.services.password_reset as password_reset_service
from backend.app.models import ResetPass, EmailStrRequest, VerifyResetTokenRequest



password_reset_router= APIRouter()

@password_reset_router.post("/send_password_reset_email")
async def send_password_reset_email(request:EmailStrRequest):
    return await password_reset_service.send_password_reset_email(request.email)

@password_reset_router.post("/reset_password")
async def reset_password(request: ResetPass):
    return await password_reset_service.reset_password(request.email, request.token, request.new_password)
