from fastapi import HTTPException
from backend.app.database import users, cart
from backend.app.models import Favorite
from datetime import datetime


async def get_cart_items(user_id:str):
    user= await users.find_one({"_id":user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_favorites= await cart.find({"user_id":user_id}).to_list()

    return {
    "message":"cart items retrieved successfully",
    "favorites":user_favorites
    }

async def add_cart_item(user_id:int, item_id:int):
    user= await users.find_one({"_id":user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    fav_document={}
    exist_item= await cart.find_one({"user_id":user_id, "item_id":item_id})
    if exist_item:
        fav_document= {
            "user_id":user_id,
            "updated_at":datetime.utcnow(),
            "item_id":item_id ,#book id
            "quantity":exist_item["quantity"]+1     
        }
    else:
        fav_document= {
            "user_id":user_id,
            "created_at":datetime.utcnow(),
            "item_id":item_id ,#book id
            "quantity":1
        }
    
    result= await cart.insert_one(fav_document)
    return {
        "message":"Favorite added successfully",
        "favorite_id":str(result.inserted_id)
    }

async def delete_cart_item(user_id:int, item_id:int):
    user= await users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    
    fav= await cart.find_one({"user_id":user_id, "item_id":item_id})
    if not fav:
        raise HTTPException(status_code=404, details="item not found")
    await cart.delete_one({"user_id":user_id, "item_id":item_id})
    return {
        "message":"cart item deleted successfully"
    }
    

async def get_cart_item(user_id:int, item_id:int):
    user= await users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    fav= await cart.find_one({"user_id":user_id, "item_id":item_id})
    if not fav:
        raise HTTPException(status_code=404, details="item not found")
    
    res= Favorite(**fav)
    return {
        "message":f"cart item {item_id} retrieved successfully",
        "favorite":res
    }

async def get_cart_count(user_id:int):
    user= await users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    favs= await cart.find()
    return {
        "message":"cart items retrieved successfully",
        "favorite":favs
    }

async def clear_cart_items(user_id:int):
    user= users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    result= await cart.delete_many({"user_id":user_id})
    return {
        "message":f"{result.deleted_count} Favorite items has been cleared successfully",
    }
