from fastapi import HTTPException, Depends
from backend.app.database import favorites, users, cart, store_books, wishlist_shares
from backend.app.models import Favorite, Book
from datetime import datetime
from bson import ObjectId
from backend.app.models import FavoriteItemResponse
from backend.app.utils import check_user_existence_by_id, generate_share_token, share_expiry
import random


async def get_favorites(user_id:str):
    user_object_id=await check_user_existence_by_id(user_id)
    
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

async def add_favorite(user_id:str, book:Book):
    
    user_object_id=await check_user_existence_by_id(user_id)
    print(user_object_id)


    store_book = await store_books.find_one({"id": book.id})
    if not store_book:
        if book.saleInfo.saleability == "FOR_SALE":
            book.saleInfo.price = round(random.uniform(5, 50), 2)
        else:
            book.saleInfo.price = 0

        await store_books.insert_one(book.model_dump(mode="json"))
    else:
        stored_price = store_book.get("saleInfo", {}).get("price")
        if stored_price is not None:
            book.saleInfo.price = stored_price

    book_dict = book.model_dump(mode="json")
    fav_document= {
        "user_id":user_object_id,
        "created_at":datetime.utcnow(),
        "item_id":book.id, #book id
        "book":book_dict #full json book
    }
    result= await favorites.insert_one(fav_document)

    favs= await favorites.find({"user_id":user_object_id}).to_list()
    result = []
    for f in favs:
        f["_id"] = str(f["_id"])
        f["user_id"] = str(f["user_id"])
        result.append(FavoriteItemResponse(**f))

    return {
        "message":"Favorite added successfully",
        "favorites":result
    }

async def delete_favorite(user_id:str, item_id:str):
    user_object_id=await check_user_existence_by_id(user_id)
    
    fav= await favorites.find_one({"user_id":user_object_id, "item_id":item_id})
    if not fav:
        raise HTTPException(status_code=404, detail="item not found")
    await favorites.delete_one({"user_id":user_object_id, "item_id":item_id})

    favs= await favorites.find({"user_id":user_object_id}).to_list()
    result = []
    for f in favs:
        f["_id"] = str(f["_id"])
        f["user_id"] = str(f["user_id"])
        result.append(FavoriteItemResponse(**f))

    return {
        "message":"Favorite deleted successfully",
        "favorites":result
    }
    

async def get_favorite(user_id:str, item_id:str):
    user_object_id=await check_user_existence_by_id(user_id)

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
    await check_user_existence_by_id(user_id)

    favs= await favorites.count_documents({})
    return {
        "message":"Favorite items retrieved successfully",
        "favorite":favs
    }

async def clear_favorites(user_id:str):
    user_object_id=await check_user_existence_by_id(user_id)

    result= await favorites.delete_many({"user_id":user_object_id})
    return {
        "message":f"{result.deleted_count} Favorite items has been cleared successfully",
    }

async def move_to_cart(user_id:str):
    user_object_id=await check_user_existence_by_id(user_id)
    
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
            book_dict=fav.book.dict()
            await cart.insert_one({
                "user_id":user_object_id,
                "item_id":fav.item_id,
                "updated_at":datetime.utcnow(),
                "quantity":1,
                "book":book_dict
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

async def create_favorites_share(user_id: str):
    user_object_id = await check_user_existence_by_id(user_id)

    token = generate_share_token()

    await wishlist_shares.insert_one({
        "user_id": user_object_id,
        "token": token,
        "created_at": datetime.utcnow(),
        "expires_at": share_expiry()
    })

    return {
        "message": "Share link created",
        "share_url": f"/shared-wishlist/{token}"
    }

async def get_shared_favorites(token: str):
    share = await wishlist_shares.find_one({"token": token})

    if not share:
        raise HTTPException(status_code=404, detail="Invalid share link")

    if share["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=403, detail="Link expired")

    user_object_id = share["user_id"]

    user_favorites = await favorites.find({"user_id": user_object_id}).to_list(length=None)

    result = []
    for fav in user_favorites:
        fav["_id"] = str(fav["_id"])
        fav["user_id"] = str(fav["user_id"])
        result.append(FavoriteItemResponse(**fav))

    return {
        "message": "Shared favorites retrieved",
        "favorites": result
    }