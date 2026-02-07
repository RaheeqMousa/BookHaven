from fastapi import APIRouter
import backend.app.services.auth as auth_service
from backend.app.models import Signin, Signup


auth_routers = APIRouter()
@auth_routers.post("/signin")
async def signin(request:Signin):
    return await auth_service.signin(request.email, request.password)

@auth_routers.post("/signup")
async def signup(request:Signup):
    return await auth_service.create_user(request.username, request.password, request.email)