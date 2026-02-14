from fastapi import APIRouter, Depends
from backend.app.database import favorites,users
import backend.app.services.favorites as favorites_services
from backend.app.models import FavoriteRequest
from backend.app.auth.dependencies import get_current_user

favorites_router= APIRouter()

@favorites_router.post("/add_favorite")
async def add_favorite(req:FavoriteRequest, user_id: str = Depends(get_current_user)):
    # print(req.book)
    return await favorites_services.add_favorite(user_id, req.book)

@favorites_router.delete("/delete_favorite")
async def delete_favorite(item_id:str, user_id: str = Depends(get_current_user)):
    return await favorites_services.delete_favorite(user_id, item_id)

@favorites_router.delete("/clear_favorites")
async def clear_favorites(user_id: str = Depends(get_current_user)):
    return await favorites_services.clear_favorites(user_id)

@favorites_router.get("/get_favorites")
async def get_favorites(user_id: str = Depends(get_current_user)):
    return await favorites_services.get_favorites(user_id)

@favorites_router.get("/get_favorite")
async def get_favorite(item_id:str, user_id: str = Depends(get_current_user)):
    return await favorites_services.get_favorite(user_id, item_id)

@favorites_router.get("/get_favorite_count")
async def get_favorite_count(user_id: str = Depends(get_current_user)):
    return await favorites_services.get_favorite_count(user_id)

@favorites_router.post("/move_all_to_cart")
async def move_to_cart(user_id: str = Depends(get_current_user)):
    return await favorites_services.move_to_cart(user_id)