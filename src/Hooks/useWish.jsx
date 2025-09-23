import { useState, useEffect, useCallback } from "react";

const useWish = (book) => {
    const [isWished, setIsWished] = useState(false);

    useEffect(() => {
        const cart = localStorage.getItem("wishlist")
            ? JSON.parse(localStorage.getItem("wishlist"))
            : [];
        setIsWished(cart.some((item) => item.id === book.id));
    }, [book]);

    const toggleWish = useCallback(() => {
        let cart = localStorage.getItem("wishlist")
            ? JSON.parse(localStorage.getItem("wishlist"))
            : [];

        if (!isWished) {
            cart.push({
                id: book.id,
                saleInfo: {
                    saleability: book.saleInfo.saleability,
                    price: book.saleInfo.listPrice?.amount || Math.floor(Math.random() * 20) + 5,
                },
                volumeInfo: {
                    title: book.volumeInfo.title,
                    subtitle: book.volumeInfo.subtitle || "",
                    authors: book.volumeInfo.authors || [],
                    printType: book.volumeInfo.printType,
                    categories: book.volumeInfo.categories || [],
                    pageCount: book.volumeInfo.pageCount,
                    imageLinks: {
                        smallThumbnail: book.volumeInfo.imageLinks?.smallThumbnail || "",
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
                    },
                },
            });
        } else {
            cart = cart.filter((item) => item.id !== book.id);
        }

        localStorage.setItem("wishlist", JSON.stringify(cart));
        setIsWished(!isWished);
    }, [book, isWished]);

    return [isWished, toggleWish];
};

export default useWish;
