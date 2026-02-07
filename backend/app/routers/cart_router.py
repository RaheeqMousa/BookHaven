from fastapi import APIRouter
import backend.app.services.cart as cart_services

cart_router= APIRouter()


@cart_router.post("add_cart_item")
async def add_cart_item(user_id:int, item_id:int):
    await cart_services.add_cart_item(user_id, item_id)

@cart_router.delete("delete_cart_item")
async def delete_cart_item(user_id:int, item_id:int):
    await cart_services.delete_cart_item(user_id, item_id)

@cart_router.post("clear_cart_items")
async def clear_cart_items(user_id:int):
    await cart_services.clear_cart_items(user_id)

@cart_router.get("get_cart_items")
async def get_cart_items(user_id:int):
    await cart_services.get_cart_items(user_id)

@cart_router.get("get_cart_item")
async def get_cart_item(user_id:int, item_id:int):
    await cart_services.get_cart_item(user_id, item_id)

@cart_router.get("get_cart_count")
async def get_cart_count(user_id:int):
    await cart_services.get_cart_count(user_id)