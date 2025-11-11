import { useState, useEffect, useCallback, useContext } from "react";
import { UserContext } from "../Context/UserContext";

function useCart() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState([]);

    const loadCart = useCallback(() => {
        if (!user) return setCart([]);
        const stored = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(stored.filter((item) => item.userId === user.id));
    }, [user]);


    const updateCart = useCallback(
        (newCart) => {
            if (!user) return;
            const stored = JSON.parse(localStorage.getItem("cart")) || [];
            const others = stored.filter((item) => item.userId !== user.id);
            const merged = [...others, ...newCart.map((item) => ({ ...item, userId: user.id }))];
            localStorage.setItem("cart", JSON.stringify(merged));
            setCart(newCart);
        },
        [user]
    );


    const addToCart = useCallback(
        (book, price = null) => {
            if (!user) return alert("Please log in to add items to your cart.");

            const existing = cart.find((b) => b.id === book.id);
            let updated;

            if (existing) {
                updated = cart.map((b) =>
                    b.id === book.id ? { ...b, quantity: (b.quantity || 1) + 1 } : b
                );
            } else {
                updated = [
                    ...cart,
                    {
                        userId: user.id,
                        id: book.id,
                        addedAt: new Date().toISOString(),
                        quantity: 1,
                        saleInfo: {
                            saleability: book.saleInfo?.saleability,
                            price: book.saleInfo?.listPrice?.amount || price || 10,
                        },
                        volumeInfo: {
                            title: book.volumeInfo.title,
                            authors: book.volumeInfo.authors || [],
                            imageLinks: book.volumeInfo.imageLinks || {},
                        },
                        accessInfo: book.accessInfo || {},
                    },
                ];
            }

            updateCart(updated);
        },
        [cart, user, updateCart]
    );


    const removeFromCart = useCallback(
        (bookId) => {
            const updated = cart.filter((b) => b.id !== bookId);
            updateCart(updated);
        },
        [cart, updateCart]
    );

    const increment = useCallback((id) => {
        cart.find(b => (b.id === id && b.userId === user.id)).quantity += 1;
        setCart([...cart]);
        localStorage.setItem('cart', JSON.stringify(cart));

    }, [setCart, cart, user]);


    const decrement = useCallback((id) => {
        const book = cart.find(b => b.id === id && b.userId === user.id);
        if (!book) return;

        if (book.quantity > 1) {
            book.quantity -= 1;
            setCart([...cart]);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [setCart, cart, user]);

    const clearCart = useCallback(() => {
        updateCart([]);
    }, [updateCart]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    return { cart, addToCart, removeFromCart, clearCart, loadCart, setCart, decrement, increment };
}

export default useCart;
