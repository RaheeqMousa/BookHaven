import { useCallback, useEffect, useState, useContext } from "react";
import { UserContext } from "../Context/UserContext";
import api from "../Utils/axios";

const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(UserContext);

  // Load wishlist from backend
  const loadWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const res = await api.get("favorites/get_favorites",
        {headers: {
                Authorization: `Bearer ${user.token}`
            },
      }); // FastAPI endpoint
      console.log(res)
      setWishlist(res.data.favorites || []);
    } catch (err) {
      console.error("Failed to load wishlist from backend:", err);
      setWishlist([]);
    }
  }, [user]);

  //Auto-load wishlist on mount or when user changes
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  //Add an item to wishlist
  const addToWishlist = useCallback(async (itemId) => {
    if (!user) return;

    try {
      await api.post(
        "favorites/add_favorite",
        { item_id: itemId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      await loadWishlist(); // refresh state
    } catch (err) {
      console.error("Failed to add item to wishlist:", err);
    }
  }, [user, loadWishlist]);

  // Remove an item from wishlist
  const removeFromWishlist = useCallback(async (itemId) => {
    if (!user) return;

    try {
      await api.delete("favorites/delete_favorite", { 
        params: { item_id: itemId },
        headers: {
          Authorization: `Bearer ${user.token}`
        }
     });
      await loadWishlist(); // refresh state
    } catch (err) {
      console.error("Failed to remove item from wishlist:", err);
    }
  }, [user, loadWishlist]);

  // Clear all wishlist items
  const clearWishlist = useCallback(async () => {
    if (!user) return;

    try {
      await api.delete("favorites/clear_favorites");
      setWishlist([]);
    } catch (err) {
      console.error("Failed to clear wishlist:", err);
    }
  }, [user]);

  return {
    wishlist,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };
};

export default useWishlist;
