import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const useWish = (book, bookPrice) => {
    const navigate= useNavigate();
    const [isWished, setIsWished] = useState(false);
    const user= useContext(UserContext);


    useEffect(() => {
        try {
            const cartData = localStorage.getItem("wishlist");
            const wishlist = cartData
                ? JSON.parse(cartData)
                : [];
            const user = JSON.parse(localStorage.getItem("user"))||JSON.parse(sessionStorage.getItem("user"));

            const wishlistArray = Array.isArray(wishlist) ? wishlist : [wishlist];

            const wished = wishlistArray.some(
                (item) => item.id === book.id && item.userId === user.id
            );

            setIsWished(wished);
        } catch (err) {
            console.error("Failed to get wishlist from localStorage:", err);
            setIsWished(false);
        }
    }, [book]);

    const toggleWish = useCallback(() => {
        if(!user){
            navigate('/auth/login');
        }

        let cart = localStorage.getItem("wishlist")
            ? JSON.parse(localStorage.getItem("wishlist"))
            : [];

        if (!isWished) {
            cart.push({
                userId: user.id,
                id: book.id,
                addedAt: new Date().toISOString(),
                saleInfo: {
                    saleability: book.saleInfo.saleability,
                    price: book.saleInfo.listPrice?.amount || bookPrice,
                },
                volumeInfo: {
                    title: book.volumeInfo.title,
                    subtitle: book.volumeInfo.subtitle || "",
                    authors: book.volumeInfo.authors || [],
                    printType: book.volumeInfo.printType,
                    categories: book.volumeInfo.categories || [],
                    pageCount: book.volumeInfo.pageCount,
                    description: book.volumeInfo.description,
                    imageLinks: {
                        smallThumbnail: book.volumeInfo.imageLinks?.smallThumbnail || "",
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
                    },
                },
                accessInfo: {
                    webReaderLink: book.accessInfo.webReaderLink
                }
            });
        } else {
            cart = cart.filter((item) => item.id !== book.id);
        }

        localStorage.setItem("wishlist", JSON.stringify(cart));
        setIsWished(!isWished);
    }, [book, isWished, navigate, bookPrice,user]);

    return [isWished, toggleWish];
};

export default useWish;
