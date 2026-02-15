import {WishlistContext} from './WishlistContext'
import React,{useEffect,useState,useContext, useCallback} from 'react'
import { UserContext } from '../Context/UserContext';
import api from '../Utils/axios';

function WishlistContextProvider({children}){

    const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(UserContext);

  const token = user?.token;

  const loadWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const res = await api.get("favorites/get_favorites",
        {headers: {
                Authorization: `Bearer ${token}`
            },
      }); // FastAPI endpoint
      console.log(res)
      setWishlist(res.data.favorites || []);
    } catch (err) {
      console.error("Failed to load wishlist from backend:", err);
      setWishlist([]);
    }
  }, [token]);

  //Auto-load wishlist on mount or when user changes
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  //Add an item to wishlist
  const addToWishlist = useCallback(async (payload) => {
    console.log(payload)
    if (!token) return;

    try {
      const res=await api.post(
        "favorites/add_favorite",
        {"book":payload},   // request body
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );
      setWishlist(res.data.favorites) // refresh state
    } catch (err) {
      console.error("Failed to add item to wishlist:", err);
    }
  }, [token]);

  // Remove an item from wishlist
  const removeFromWishlist = useCallback(async (itemId) => {
    if (!token) return;

    try {
      const res=await api.delete("favorites/delete_favorite", { 
        params: { item_id: itemId },
        headers: {
          Authorization: `Bearer ${token}`
        }
     });
    //   await loadWishlist(); // refresh state
    setWishlist(res.data.favorites)
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err);
    }
  }, [token]);

  // Clear all wishlist items
  const clearWishlist = useCallback(async () => {
    if (!token) return;

    try {
      await api.delete("favorites/clear_favorites",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      );
      setWishlist([]);
    } catch (err) {
      console.error("Failed to clear wishlist:", err);
    }
  }, [token]);


  const value={
        wishlist,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
    };

  return(
    <WishlistContext.Provider value={value}>
        {children}
    </WishlistContext.Provider>
  )

}
export default WishlistContextProvider