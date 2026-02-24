from fastapi import FastAPI
from backend.app.routers.auth_router import auth_routers
from backend.app.routers.email_verification_router import email_verification_router
from backend.app.routers.password_reset_router import password_reset_router
from backend.app.routers.favorites_router import favorites_router
from backend.app.routers.cart_router import cart_router
from fastapi.middleware.cors import CORSMiddleware

app= FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "https://myfrontend.com" #will change it in future
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,#List of allowed origins
    allow_credentials=True,#Allow cookies/auth headers
    allow_methods=["*"],#Allow all HTTP methods
    allow_headers=["*"],#Allow all headers
)

app.include_router(auth_routers, prefix="/auth", tags=["auth"])
app.include_router(email_verification_router, prefix="/email_verification", tags=["email_verification"])
app.include_router(password_reset_router, prefix="/password_reset", tags=["password_reset"])
app.include_router(favorites_router, prefix="/favorites", tags=["favorites"])
app.include_router(cart_router, prefix="/cart", tags=["cart"])