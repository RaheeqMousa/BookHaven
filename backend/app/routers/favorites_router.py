from fastapi import APIRouter
from backend.app.database import favorites,users
import backend.app.services.favorites as favorites_services

favorites_router= APIRouter()

@favorites_router.post("add_favorite")
async def add_favorite(user_id:int, item_id:int):
    await favorites_services.add_favorite(user_id)

@favorites_router.delete("delete_favorite")
async def delete_favorite(user_id:int, item_id:int):
    await favorites_services.delete_favorite(user_id, item_id)

@favorites_router.post("clear_favorites")
async def clear_favorites(user_id:int):
    await favorites_services.clear_favorites(user_id)

@favorites_router.get("get_favorites")
async def get_favorites(user_id:int):
    await favorites_services.get_favorites(user_id)

@favorites_router.get("get_favorite")
async def get_favorite(user_id:int, item_id:int):
    await favorites_services.get_favorite(user_id, item_id)

@favorites_router.get("get_favorite_count")
async def get_favorite_count(user_id:int):
    await favorites_services.get_favorite_count(user_id)

@favorites_router.post("move_all_to_cart")
async def move_to_cart(user_id:int):
    await favorites_services.move_to_cart(user_id)