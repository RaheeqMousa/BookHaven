from fastapi import APIRouter, Depends
import backend.app.services.cart as cart_services
from backend.app.models import CartRequest
from backend.app.auth.dependencies import get_current_user


cart_router= APIRouter()


@cart_router.post("/add_cart_item")
async def add_cart_item(req:CartRequest, user_id: str = Depends(get_current_user)):
    return await cart_services.add_cart_item(user_id, req.item_id)

@cart_router.delete("/delete_cart_item")
async def delete_cart_item(item_id:str, user_id: str = Depends(get_current_user)):
    return await cart_services.delete_cart_item(user_id, item_id)

@cart_router.delete("/clear_cart_items")
async def clear_cart_items(user_id: str = Depends(get_current_user)):
    return await cart_services.clear_cart_items(user_id)

@cart_router.get("/get_cart_items")
async def get_cart_items(user_id: str = Depends(get_current_user)):
    return await cart_services.get_cart_items(user_id)

@cart_router.get("/get_cart_item")
async def get_cart_item(item_id:str, user_id: str = Depends(get_current_user)):
    return await cart_services.get_cart_item(user_id, item_id)

@cart_router.get("/get_cart_count")
async def get_cart_count(user_id: str = Depends(get_current_user)):
    return await cart_services.get_cart_count(user_id)