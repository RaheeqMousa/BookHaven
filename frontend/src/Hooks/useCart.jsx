import { useState, useEffect, useCallback, useContext } from "react";
import { UserContext } from "../Context/UserContext";
import api from '../Utils/axios'

function useCart() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState([]);

    const loadCart = useCallback(async () => {
        if (!user) {
            setCart([]);
            return;
        }

        try {
            const res = await api.get("cart/get_cart_items", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setCart(res.data.data);
        } catch (err) {
            console.error("Failed to load cart", err);
        }
    }, [user]);


    const updateCart = useCallback((cart) => {
        setCart(cart);
    }, []);

    const addToCart = useCallback(
        async (book, price = null) => {
            if (!user) return alert("Please log in to add items to your cart.");
            try{
                const payload = {
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
                };
                const res= await api.post('cart/add_cart_item', 
                    {"book":payload},
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                )
                console.log(res)
                updateCart(res.data.data)
                
            }catch(err){
                console.log(err)
            }
            // const existing = cart.find((b) => b.id === book.id);
            // let updated;

            // if (existing) {
            //     updated = cart.map((b) =>
            //         b.id === book.id ? { ...b, quantity: (b.quantity || 1) + 1 } : b
            //     );
            // } else {
            //     updated = [
            //         ...cart,
            //         {
            //             userId: user.id,
            //             id: book.id,
            //             addedAt: new Date().toISOString(),
            //             quantity: 1,
            //             saleInfo: {
            //                 saleability: book.saleInfo?.saleability,
            //                 price: book.saleInfo?.listPrice?.amount || price || 10,
            //             },
            //             volumeInfo: {
            //                 title: book.volumeInfo.title,
            //                 authors: book.volumeInfo.authors || [],
            //                 imageLinks: book.volumeInfo.imageLinks || {},
            //             },
            //             accessInfo: book.accessInfo || {},
            //         },
            //     ];
            // }

            // updateCart(updated);
        },
        [user,updateCart]
    );


    const removeFromCart = useCallback(
        async (bookId) => {
            try{
                if (!user) return alert("Please log in to remove items from your cart.");
                
                const res= await api.delete('cart/delete_cart_item', {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                    params:{
                        item_id:bookId
                    }
                })
                console.log(res)
                updateCart(res.data.data)
                
            }catch(err){
                console.log(err)
            }
        },
        [user,updateCart]
    );

    const increment = useCallback(async (id) => {
        try{
            if (!cart || !user) return;

            const res= await api.patch(
                'cart/increment_quantity',
                {}, 
                {
                    params:{item_id:id},
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            console.log(res)
            updateCart(res.data.data);
        }catch(e){
            console.log(e)
        }
    }, [updateCart, cart, user]);

    const decrement = useCallback(async (id) => {
        try{
            if (!cart || !user) return;

            const res= await api.patch('cart/decrement_quantity', 
                {},
                {
                    params:{item_id:id},
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            console.log(res)
            updateCart(res.data.data);
        }catch(e){
            console.log(e)
        }
    },[cart, user, updateCart]);

    const clearCart = useCallback(() => {
        try{
            api.delete('cart/clear_cart_items',
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            updateCart([])
        }catch(e){
            console.log(e)
        }
    }, [updateCart,user]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    return { cart, addToCart, removeFromCart, clearCart, loadCart, setCart, decrement, increment };
}

export default useCart;
