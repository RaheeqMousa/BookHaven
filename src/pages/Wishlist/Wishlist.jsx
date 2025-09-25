import { useCallback, useEffect, useState } from "react";
import Back from "../../Components/Back";
import Style from './Wishlist.module.scss'
import { LuShare2 } from "react-icons/lu";
import { LuShoppingCart } from "react-icons/lu";
import BookCard from "../../Components/BookCard/BookCard";
import { calculateTotalPrice } from "../../Utils/calculateTotalPrice";
import { useNavigate } from "react-router-dom";
import { joinAuthors } from "../../Utils/JoinAuthors";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function Wishlist() {
    const { user } = useContext(UserContext);
    const [isGrid, setIsGrid] = useState(window.innerWidth > 768);
    const [items, setItems] = useState([]);
    const number_of_wished = items.length;
    const navigate = useNavigate();
    const [shareBtnSuccess, setShareBtnSuccess] = useState("");
    const [disableShareBtn, setShareBtnDisable] = useState(false);


    const loadWishlist = useCallback(() => {
        const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
        setItems(stored.filter(item => item.userId === user.id));
    }, [user]);

    const handleShare = useCallback(async () => {
        const shareData = {
            title: "Book Wishlist Collection",
            text: items.map(
                (b, i) =>
                    `${i + 1}. ${b.volumeInfo.title} by ${joinAuthors(
                        b.volumeInfo.authors
                    )}`
            )
                .join("\n"),
            url: `http://localhost:5173/wishlist/${JSON.parse(localStorage.getItem('user')).id}`
        };

        setShareBtnDisable(false);

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log("Shared successfully!");
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            navigator.clipboard.writeText(shareData.url);
            setShareBtnSuccess("Link copied to clipboard!");
            setTimeout(() => {
                setShareBtnSuccess("");
                setShareBtnDisable(true);
            }, 1000);
        }
    }, [items]);


    const handleFilterChange = useCallback((filterBy) => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const userWish = storedWishlist.filter(w => w.userId === user.id);

        const sorted = [...userWish].sort((a, b) => {
            const a_time = new Date(a.addedAt).getTime();
            const b_time = new Date(b.addedAt).getTime();
            return filterBy === "recently" ? b_time - a_time : a_time - b_time;
        });

        setItems(sorted);
    }, [user]);

    useEffect(() => {
        const handleResize = () => {
            setIsGrid(window.innerWidth > 768);
        };
        console.log('use effedct')
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        try {
            const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const userWish = storedWishlist.filter(w => w.userId === user.id);

            const sorted = [...userWish].sort((a, b) => {
                const a_time = new Date(a.addedAt).getTime();
                const b_time = new Date(b.addedAt).getTime();
                return b_time - a_time;
            });
            if (userWish) {
                setItems(sorted);
            } else {
                setItems([]);
            }
        } catch (e) {
            console.error(e);
            setItems([]);
        }
    }, [handleFilterChange, user]);


    const clearWishlist = useCallback(() => {
        localStorage.setItem('wishlist', JSON.stringify([]));
        setItems([]);
    }, []);


    const addAllToCart = () => {
        if (!localStorage.getItem('user')) {
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
                        <button disabled={disableShareBtn} onClick={handleShare} className={`row justify-content-center `} aria-label="Share wishlist button">
                            {shareBtnSuccess ? shareBtnSuccess :
                                <>
                                    <LuShare2 color="1A237E" size={16} />
                                    Share Wishlist
                                </>
                            }
                        </button>
                    </div>
                </div>
            </div>

            <div className={`row width-100 ${Style['filter-section']}`}>
                <p>Showing {number_of_wished} books</p>
                <div className={`row ${Style.filter}`}>
                    <select onChange={e => handleFilterChange(e.target.value)}>
                        <option value={'recently'}>Recently Added</option>
                        <option value={'oldest'} >Oldest Fisrt</option>
                    </select>
                    <button onClick={addAllToCart}>Add All to Cart</button>
                </div>
            </div>

            <div className={`row justify-content-start width-100 ${Style.books}`}>
                {items.map((b) =>
                    <BookCard book={b} key={b.id} isGridDisplay={isGrid} wishlistChange={loadWishlist} />
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