import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import api from "../Utils/axios";

const useWish = (book, bookPrice) => {
    const navigate = useNavigate();
    const [isWished, setIsWished] = useState(false);
    const { user } = useContext(UserContext);


    const fetchWishlist = useCallback(async () => {
        try {
            const res = await api.get("favorites/get_favorites",{
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        });
            const wishlistData = res.data.favorites || [];

            const wishlistArray = Array.isArray(wishlistData) ? wishlistData : [wishlistData];

            const wished = wishlistArray.some(
                (item) => item.book.id === book.id
            );

            setIsWished(wished); // true if already in favorites, false otherwise
        } catch (err) {
            console.error("Failed to get wishlist from backend:", err);
            setIsWished(false);
        }
    },[book,user]);

    useEffect( () => {
       fetchWishlist()
    }, [fetchWishlist]);

    // const toggleWish = useCallback(() => {
    //     if (!user) {
    //         navigate('/auth/login');
    //     }

    //     let wishlist = localStorage.getItem("wishlist")
    //         ? JSON.parse(localStorage.getItem("wishlist"))
    //         : [];

    //     if (!isWished) {
    //         wishlist.push({
    //             userId: user.id,
    //             id: book.id,
    //             addedAt: new Date().toISOString(),
    //             saleInfo: {
    //                 saleability: book.saleInfo.saleability,
    //                 price: book.saleInfo.listPrice?.amount || bookPrice,
    //             },
    //             volumeInfo: {
    //                 title: book.volumeInfo.title,
    //                 subtitle: book.volumeInfo.subtitle || "",
    //                 authors: book.volumeInfo.authors || [],
    //                 printType: book.volumeInfo.printType,
    //                 categories: book.volumeInfo.categories || [],
    //                 pageCount: book.volumeInfo.pageCount,
    //                 description: book.volumeInfo.description,
    //                 imageLinks: {
    //                     smallThumbnail: book.volumeInfo.imageLinks?.smallThumbnail || "",
    //                     thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
    //                 },
    //             },
    //             accessInfo: {
    //                 webReaderLink: book.accessInfo.webReaderLink
    //             }
    //         });
    //     } else {
    //         wishlist = wishlist.filter((item) => item.id !== book.id);
    //     }

    //     localStorage.setItem("wishlist", JSON.stringify(wishlist));
    //     setIsWished(!isWished);
    // }, [book, isWished, navigate, bookPrice, user]);
    const toggleWish = useCallback(async () => {
        if (!user) {
            navigate('/auth/login');
            return;
        }

        try {
            if (!isWished) {
            const payload = {
                id: book.id,
                addedAt: new Date().toISOString(),
                saleInfo: {
                    saleability: book.saleInfo?.saleability || "NOT_FOR_SALE",
                    price: book.saleInfo?.listPrice?.amount || bookPrice,
                },
                volumeInfo: {
                    title: book.volumeInfo.title,
                    subtitle: book.volumeInfo.subtitle || "",
                    authors: book.volumeInfo.authors || [],
                    printType: book.volumeInfo.printType || "",
                    categories: book.volumeInfo.categories || [],
                    pageCount: book.volumeInfo.pageCount || 0,
                    description: book.volumeInfo.description || "",
                    imageLinks: {
                        smallThumbnail: book.volumeInfo.imageLinks?.smallThumbnail || "",
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
                    },
                },
                accessInfo: {
                    webReaderLink: book.accessInfo?.webReaderLink || "",
                },
            };

            // console.log(payload);
            await api.post(
                "favorites/add_favorite",
                {"book":payload},   // request body
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            setIsWished(true);
            } else {
            await api.delete("favorites/delete_favorite", 
            { 
                params: { item_id: book.id }, 
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setIsWished(false);
            }
        } catch (err) {
            console.log(err);
        }
    }, [book, isWished, navigate, user, bookPrice]);


    return [isWished, toggleWish];
};

export default useWish;
