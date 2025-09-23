import { useCallback, useEffect, useState } from "react";
import Back from "../../Components/Back";
import Style from './Wishlist.module.scss'
import { LuShare2 } from "react-icons/lu";
import { LuShoppingCart } from "react-icons/lu";
import BookCard from "../../Components/BookCard/BookCard";
import { calculateTotalPrice } from "../../Utils/calculateTotalPrice";
import { useNavigate } from "react-router-dom";

function Wishlist() {

    const [items, setItems] = useState([]);
    const number_of_wished = items.length;
    const navigate=useNavigate();

    useEffect(() => {
        try {
            const storedWishlist = localStorage.getItem('wishlist');
            if (storedWishlist) {
                setItems(JSON.parse(storedWishlist));
            } else {
                setItems([]);
            }
        } catch (e) {
            console.error(e);
            setItems([]);
        }
    }, []);


    const clearWishlist = useCallback(() => {
        localStorage.setItem('wishlist', JSON.stringify([]));
        setItems([]);
    }, []);


    const addAllToCart = () => {
        if(!localStorage.getItem('user')){
            navigate('/auth/login');
        }

        const wishlist = localStorage.getItem("wishlist") ? JSON.parse(localStorage.getItem("wishlist")) : [];

        if (wishlist.length === 0) return;

        const cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

        const updatedCart = [...cart];
        wishlist.forEach((item) => {
            const existingItem = updatedCart.find((c) => c.id === item.id);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                updatedCart.push({ ...item, quantity: 1 });
            }
        });

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        localStorage.setItem("wishlist", JSON.stringify([]));
        setItems([]);
    };


    const totalPrice = calculateTotalPrice(items);

    return (
        <section className={`row  flex-direction-column ${Style['wishlist-section']}`}>
            <div className={`row flex-direction-column width-100 align-start ${Style['intro']}`}>
                <Back className={Style.back} />
                <div className={`row width-100`}>
                    <div className={`row flex-direction-column ${Style['share-left-side']}`}>
                        <h1 className="width-100">My Wishlist</h1>
                        <p className="width-100">{number_of_wished} Books save for later</p>
                    </div>

                    <div className={`row justify-content-center align-center ${Style['share-wishlist']}`}>
                        <button className={`row justify-content-center `}>
                            <LuShare2 color="1A237E" size={16} />
                            Share Wishlist
                        </button>
                    </div>
                </div>
            </div>

            <div className={`row width-100 ${Style['filter-section']}`}>
                <p>Showing {number_of_wished} books</p>
                <div className={`row ${Style.filter}`}>
                    <select>
                        <option>Recently Added</option>
                    </select>
                    <button onClick={addAllToCart}>Add All to Cart</button>
                </div>
            </div>

            <div className={`row justify-content-start ${Style.books}`}>
                {items.map((b) =>
                    <BookCard book={b} key={b.id} isGridDisplay={true} />
                )
                }
            </div>

            <div className={`row width-100 ${Style.purchase}`}>
                <div className="row flex-direction-column align-start">
                    <h3>Ready to purchase?</h3>
                    <p>Add all items to your cart with one click</p>
                </div>
                <div className={`row`}>
                    <button className={Style.clear} onClick={clearWishlist}>Clear Wishlist</button>
                    <button className={`row  ${Style['add-to-cart']}`} onClick={addAllToCart}>
                        <LuShoppingCart color="white" size={16} />
                        Add All to Cart ${totalPrice}
                    </button>
                </div>
            </div>
        </section>
    );
}
export default Wishlist;