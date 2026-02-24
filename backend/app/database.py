import os
import motor.motor_asyncio
from dotenv import load_dotenv
import motor.motor_asyncio

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "bookhaven_db")
if not MONGO_URI:
    raise ValueError("MONGO_URI not set or .env file not found.")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

# Database
db = client[DB_NAME]

fs = motor.motor_asyncio.AsyncIOMotorGridFSBucket(db)
users = db['users']
favorites= db['favorites']
email_verification= db['email_verification']
password_resets= db['password_resets']
cart= db['cart']
store_books= db['store_books']