from fastapi import HTTPException
from backend.app.database import users, cart
from backend.app.models import Favorite
from datetime import datetime
from bson import ObjectId
from backend.app.models import CartItemResponse

async def get_cart_items(user_id:str):
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_cart_items= await cart.find({"user_id":user_object_id}).to_list()
    if not user_cart_items:
        raise HTTPException(status_code=404, detail="No cart items found")
    result=[]
    for item in user_cart_items:
        item["_id"] = str(item["_id"])
        item["user_id"] = str(item["user_id"])
        result.append(CartItemResponse(**item))

    return {
    "message":"cart items retrieved successfully",
    "cart_items":user_cart_items
    }


async def add_cart_item(user_id:str, item_id:str):
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cart_item_document={}
    exist_item= await cart.find_one({"user_id":user_object_id, "item_id":item_id})
    if exist_item:
        cart_item_document= {
            "user_id":user_object_id,
            "updated_at":datetime.utcnow(),
            "item_id":item_id ,#book id
            "quantity":exist_item["quantity"]+1     
        }
    else:
        cart_item_document= {
            "user_id":user_object_id,
            "created_at":datetime.utcnow(),
            "item_id":item_id ,#book id
            "quantity":1
        }
    
    result= await cart.insert_one(cart_item_document)
    return {
        "message":"Favorite added successfully",
        "favorite_id":str(result.inserted_id)
    }


async def delete_cart_item(user_id:str, item_id:str):
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    
    cart_item= await cart.find_one({"user_id":user_object_id, "item_id":item_id})
    if not cart_item:
        raise HTTPException(status_code=404, detail="item not found")
    if cart_item["quantity"]>1:
        print(cart_item)
        await cart.update_one(
            {"_id":cart_item["_id"]},
            {
                "$inc":{"quantity":-1},
                "$set":{"updated_at":datetime.utcnow()}
            }
        )
    else:
        await cart.delete_one({"user_id":user_object_id, "item_id":item_id})
    return {
        "message":"cart item deleted successfully"
    }


async def get_cart_item(user_id:str, item_id:str):
    user_object_id= ObjectId(user_id)
    print(user_object_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    fav= await cart.find_one({"user_id":user_object_id, "item_id":item_id})
    if not fav:
        raise HTTPException(status_code=404, detail="item not found")
    
    fav["_id"] = str(fav["_id"])
    fav["user_id"] = str(fav["user_id"])
    res= CartItemResponse(**fav)
    return {
        "message":f"cart item {item_id} retrieved successfully",
        "cart_items":res
    }


async def get_cart_count(user_id:str):
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    cart_items= await cart.count_documents({})
    return {
        "message":"cart items retrieved successfully",
        "cart_count":cart_items
    }


async def clear_cart_items(user_id:str):
    user_object_id= ObjectId(user_id)
    user= users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    result= await cart.delete_many({"user_id":user_object_id})
    return {
        "message":f"{result.deleted_count} cart items has been cleared successfully",
    }
