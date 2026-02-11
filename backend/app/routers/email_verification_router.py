from fastapi import HTTPException, APIRouter
from backend.app.models import VerifyCodeRequest, SendCodeRequest
import backend.app.services.email_verification as email_verification_services


email_verification_router = APIRouter()

@email_verification_router.post('/verify_code')
async def verify_email(request:VerifyCodeRequest):
    return await email_verification_services.verify_code(request.email, request.code)
    
@email_verification_router.post("/send_code")
async def send_code(request: SendCodeRequest):
    return await email_verification_services.send_verification_code(request.email)

@email_verification_router.post("/resend_verification_code")
async def resend_verification_code(request: SendCodeRequest):
    return await email_verification_services.send_verification_code(request.email)
