import { useCallback, useEffect, useState, useContext } from "react";
import { UserContext } from "../Context/UserContext";

const useWishlist = (userId = null) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(UserContext);

 const loadWishlist = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
      const idToUse = userId || user?.id; //use the provided userId, and fallback to logged-in user
      const userWishlist = idToUse ? stored.filter((item) => item.userId === idToUse) : [];
      setWishlist(userWishlist);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setWishlist([]);
    }
  }, [user, userId]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const updateWishlist = useCallback((newList) => {
    setWishlist(newList);
    localStorage.setItem("wishlist", JSON.stringify(newList));
  }, []);

  const clearWishlist = useCallback(() => {
    updateWishlist([]);
  }, [updateWishlist]);

  return { wishlist, setWishlist: updateWishlist, clearWishlist, loadWishlist };
};

export default useWishlist;
