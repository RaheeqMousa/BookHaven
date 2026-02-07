from fastapi import HTTPException
from backend.app.database import favorites, users, cart
from backend.app.models import Favorite
from datetime import datetime


async def get_favorites(user_id:str):
    user= await users.find_one({"_id":user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_favorites= await favorites.find({"user_id":user_id}).to_list()

    return {
    "message":"Favorites retrieved successfully",
    "favorites":user_favorites
    }

async def add_favorite(user_id:int, item_id:int):
    user= await users.find_one({"_id":user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    fav_document= {
        "user_id":user_id,
        "created_at":datetime.utcnow(),
        "item_id":item_id #book id
    }
    result= await favorites.insert_one(fav_document)

    return {
        "message":"Favorite added successfully",
        "favorite_id":str(result.inserted_id)
    }

async def delete_favorite(user_id:int, item_id:int):
    user= await users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    
    fav= await favorites.find_one({"user_id":user_id, "item_id":item_id})
    if not fav:
        raise HTTPException(status_code=404, details="item not found")
    await favorites.delete_one({"user_id":user_id, "item_id":item_id})
    return {
        "message":"Favorite deleted successfully"
    }
    

async def get_favorite(user_id:int, item_id:int):
    user= await users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    fav= await favorites.find_one({"user_id":user_id, "item_id":item_id})
    if not fav:
        raise HTTPException(status_code=404, details="item not found")
    
    res= Favorite(**fav)
    return {
        "message":f"Favorite item {item_id} retrieved successfully",
        "favorite":res
    }

async def get_favorite_count(user_id:int):
    user= await users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    favs= await favorites.find()
    return {
        "message":"Favorite items retrieved successfully",
        "favorite":favs
    }

async def clear_favorites(user_id:int):
    user= users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    result= await favorites.delete_many({"user_id":user_id})
    return {
        "message":f"{result.deleted_count} Favorite items has been cleared successfully",
    }

async def move_to_cart(user_id:int):
    user= await users.find_one({"user_id":user_id})
    if not user:
        raise HTTPException(status_code=404,details="User not found")
    
    user_favorites= await favorites.find({"user_id":user_id}).to_list()
    if not user_favorites:
        return {"message": "No favorites to move"}
    
    moved_count=0
    for fav in user_favorites:
        item_id=fav["item_id"]
        existing_item= await cart.find_one({"user_id":user_id, "item_id":item_id})   
        if existing_item==False: 
            await cart.insert_one({
                "user_id":user_id,
                "item_id":fav["item_id"],
                "updated_at":datetime.utcnow(),
                "quantity":1
            })
        else:
            await cart.update_one(
                {"_id":existing_item["_id"]},
                {"$inc":{"quantity":1}, "$set":{"updated_at":datetime.utcnow()}}
            )
        moved_count+=1

    await favorites.delete_many({"user_id":user_id})

    return{
        "message": "Items moved to cart successfully",
        "result":moved_count
    }
