from fastapi import HTTPException
from backend.app.database import favorites, users, cart
from backend.app.models import Favorite
from datetime import datetime
from bson import ObjectId
from backend.app.models import FavoriteItemResponse

async def get_favorites(user_id:str):
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_favorites= await favorites.find({"user_id":user_object_id}).to_list(length=None)
    result=[]
    for fav in user_favorites:
        fav["_id"] = str(fav["_id"])
        fav["user_id"] = str(fav["user_id"])
        result.append(FavoriteItemResponse(**fav))

    return {
    "message":"Favorites retrieved successfully",
    "favorites":result
    }

async def add_favorite(user_id:str, item_id:str):
    user_object_id= ObjectId(user_id)
    user = await users.find_one({"_id": user_object_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    exist_fav= await favorites.find_one({"user_id":user_object_id,"item_id":item_id})
    if exist_fav:
        return HTTPException(status_code=409, detail="Item already in favorites")
    
    fav_document= {
        "user_id":user_object_id,
        "created_at":datetime.utcnow(),
        "item_id":item_id #book id
    }
    result= await favorites.insert_one(fav_document)

    return {
        "message":"Favorite added successfully",
        "favorite_id":str(result.inserted_id)
    }

async def delete_favorite(user_id:str, item_id:str):
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    
    fav= await favorites.find_one({"user_id":user_object_id, "item_id":item_id})
    if not fav:
        raise HTTPException(status_code=404, detail="item not found")
    await favorites.delete_one({"user_id":user_object_id, "item_id":item_id})
    return {
        "message":"Favorite deleted successfully"
    }
    

async def get_favorite(user_id:str, item_id:str):
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    fav= await favorites.find_one({"user_id":user_object_id, "item_id":item_id})
    if not fav:
        raise HTTPException(status_code=404, detail="item not found")
    
    fav["_id"] = str(fav["_id"])
    fav["user_id"] = str(fav["user_id"])
    res= Favorite(**fav)
    
    return {
        "message":f"Favorite item {item_id} retrieved successfully",
        "favorite":res
    }

async def get_favorite_count(user_id:str):
    user= await users.find_one({"_id":ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    favs= await favorites.count_documents({})
    return {
        "message":"Favorite items retrieved successfully",
        "favorite":favs
    }

async def clear_favorites(user_id:str):
    user_object_id= ObjectId(user_id)
    user= users.find_one({"user_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    result= await favorites.delete_many({"user_id":user_object_id})
    return {
        "message":f"{result.deleted_count} Favorite items has been cleared successfully",
    }

async def move_to_cart(user_id:str):
    user_object_id= ObjectId(user_id)
    user= await users.find_one({"_id":user_object_id})
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    
    print(user_object_id)
    user_favorites= await favorites.find({"user_id":user_object_id}).to_list(length=None)
    if not user_favorites:
        raise HTTPException(status_code=404, detail="No favorites found")
    
    result = []
    for fav in user_favorites:
        fav["_id"] = str(fav["_id"])
        fav["user_id"] = str(fav["user_id"])
        fav["item_id"] = fav["item_id"]
        result.append(FavoriteItemResponse(**fav))
    
    moved_count=0
    for fav in result:
        item_id=fav.item_id
        existing_item= await cart.find_one({"user_id":user_object_id, "item_id":item_id})   
        if not existing_item: 
            await cart.insert_one({
                "user_id":user_object_id,
                "item_id":fav.item_id,
                "updated_at":datetime.utcnow(),
                "quantity":1
            })
        else:
            await cart.update_one(
                {"_id":existing_item["_id"]},
                {"$inc":{"quantity":1}, "$set":{"updated_at":datetime.utcnow()}}
            )
        moved_count+=1

    await favorites.delete_many({"user_id":user_object_id})

    return{
        "message": "Items moved to cart successfully",
        "result":moved_count
    }

