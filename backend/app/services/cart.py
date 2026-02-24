from fastapi import HTTPException
from backend.app.database import users, cart, store_books
from backend.app.models import Book
from datetime import datetime
from bson import ObjectId
from backend.app.models import CartItemResponse
from backend.app.utils import check_user_existence_by_id

async def get_cart_items(user_id:str):
    user_object_id=await check_user_existence_by_id(user_id)
    
    user_cart_items= await cart.find({"user_id":user_object_id}).to_list()
    # if not user_cart_items:
    #     raise HTTPException(status_code=404, detail="No cart items found")
    result=[]
    for item in user_cart_items:
        item["_id"] = str(item["_id"])
        item["user_id"] = str(item["user_id"])
        result.append(CartItemResponse(**item))

    return {
    "message":"cart items retrieved successfully",
    "data":result
    }


async def add_cart_item(user_id:str, book:Book):
    user_object_id=await check_user_existence_by_id(user_id)
    
    cart_item_document={}
    exist_item= await cart.find_one({"user_id":user_object_id, "item_id":book.id})
    if exist_item:
        await cart.update_one(
            {"_id":exist_item["_id"]},
            {
                "$inc":{"quantity":1},
                "$set":{"updated_at":datetime.utcnow()}
            })
    else:
        store_book = await store_books.find_one({"id": book.id})
        if not store_book:
            store_books.insert_one(book.dict())
        else:
            book.saleInfo.price=store_book["saleInfo"]["price"]

        cart_item_document= {
            "user_id":user_object_id,
            "created_at":datetime.utcnow(),
            "item_id":book.id ,#book id
            "quantity":1,
            "book":book.dict()
        }
        await cart.insert_one(cart_item_document)
        

    cart_items= await cart.find({"user_id":user_object_id}).to_list()
    for item in cart_items:
        item["_id"]=str(item["_id"])
        item["user_id"]=str(item["user_id"])
    return {
        "message":"cart item added successfully",
        "data":cart_items
    }

async def increment(user_id:str, item_id:str):
    user_object_id=await check_user_existence_by_id(user_id)

    res=await cart.update_one(
        {"user_id":user_object_id,"item_id":item_id},
        {
            "$inc":{"quantity":1},
            "$set":{"updated_at":datetime.utcnow()}
        }   
    )

    if res.matched_count==0:
        raise HTTPException(status_code=404, detail="Cart item is not found")
    
    cart_items= await cart.find({"user_id":user_object_id}).to_list()
    result = []
    for item in cart_items:
        item["_id"] = str(item["_id"])
        item["user_id"] = str(item["user_id"])
        result.append(CartItemResponse(**item))

    return {
        "message":"quantity incremented successfully",
        "data":result
    }

async def decrement(user_id:str, item_id:str):
    user_object_id=await check_user_existence_by_id(user_id)

    res=await cart.update_one(
        {"user_id":user_object_id,"item_id":item_id},
        {
            "$inc":{"quantity":-1},
            "$set":{"updated_at":datetime.utcnow()}
        }   
    )

    if res.matched_count==0:
        raise HTTPException(status_code=404, detail="Cart item is not found")
    
    cart_items= await cart.find({"user_id":user_object_id}).to_list()
    result = []
    for item in cart_items:
        item["_id"] = str(item["_id"])
        item["user_id"] = str(item["user_id"])
        result.append(CartItemResponse(**item))

    return {
        "message":"quantity incremented successfully",
        "data":result
    }

async def delete_cart_item(user_id:str, item_id:str):
    user_object_id=await check_user_existence_by_id(user_id)
    
    cart_item= await cart.find_one({"user_id":user_object_id, "item_id":item_id})
    if not cart_item:
        raise HTTPException(status_code=404, detail="item not found")
    
    await cart.delete_one({"user_id":user_object_id, "item_id":item_id})
    
    cart_items= await cart.find({"user_id":user_object_id}).to_list()
    result = []
    for item in cart_items:
        item["_id"] = str(item["_id"])
        item["user_id"] = str(item["user_id"])
        result.append(CartItemResponse(**item))

    return {
        "message":"cart item deleted successfully",
        "data":result
    }


async def get_cart_item(user_id:str, item_id:str):
    user_object_id=await check_user_existence_by_id(user_id)
    
    cart_item= await cart.find_one({"user_id":user_object_id, "item_id":item_id})
    if not cart_item:
        raise HTTPException(status_code=404, detail="item not found")
    
    cart_item["_id"] = str(cart_item["_id"])
    cart_item["user_id"] = str(cart_item["user_id"])
    res= CartItemResponse(**cart_item)
    return {
        "message":f"cart item {item_id} retrieved successfully",
        "data":res
    }


async def get_cart_count(user_id:str):
    await check_user_existence_by_id(user_id)

    cart_items= await cart.count_documents({})
    return {
        "message":"cart items retrieved successfully",
        "cart_count":cart_items
    }


async def clear_cart_items(user_id:str):
    user_object_id=await check_user_existence_by_id(user_id)
    
    result= await cart.delete_many({"user_id":user_object_id})
    return {
        "message":f"{result.deleted_count} cart items has been cleared successfully",
    }
