import { useCallback, useContext, useState } from "react";
import Back from "../../Components/Back";
import Style from './Wishlist.module.scss';
import { LuShare2, LuShoppingCart } from "react-icons/lu";
import BookCard from "../../Components/BookCard/BookCard";
import { calculateTotalPrice } from "../../Utils/calculateTotalPrice";
import { useNavigate } from "react-router-dom";
import { joinAuthors } from "../../Utils/JoinAuthors";
import { UserContext } from "../../Context/UserContext";
import useMediaQuery from '@mui/material/useMediaQuery';
import useWishlist from "../../Hooks/useWishlist";
import api from "../../Utils/axios";

function Wishlist() {
    const { user } = useContext(UserContext);
    const isGrid = useMediaQuery('(min-width: 768px)');
    const navigate = useNavigate();
    const [shareBtnSuccess, setShareBtnSuccess] = useState("");
    const [disableShareBtn, setShareBtnDisable] = useState(false);

    const { wishlist, updateWishlist, clearWishlist, loadWishlist } = useWishlist();
    const number_of_wished = wishlist.length;

    const handleShare = useCallback(async () => {
        const shareData = {
            title: "Book Wishlist Collection",
            text: wishlist.map((b, i) =>
                `${i + 1}. ${b.volumeInfo.title} by ${joinAuthors(b.volumeInfo.authors)}`
            ).join("\n"),
            url: `${import.meta.env.VITE_APP_BASE_APP_URL}/wishlist/${user.id}`
        };

        setShareBtnDisable(false);

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            navigator.clipboard.writeText(shareData.url);
            setShareBtnSuccess("Link copied to clipboard!");
            setTimeout(() => setShareBtnSuccess(""), 1000);
            setShareBtnDisable(true);
        }
    }, [wishlist, user]);

    const handleFilterChange = useCallback((filterBy) => {
        const userWish = [...wishlist];
        const sorted = userWish.sort((a, b) => {
            const a_time = new Date(a.addedAt).getTime();
            const b_time = new Date(b.addedAt).getTime();
            return filterBy === "recently" ? b_time - a_time : a_time - b_time;
        });
        updateWishlist(sorted);
    }, [wishlist, updateWishlist]);

    const onFilterChange = useCallback((e) => handleFilterChange(e.target.value), [handleFilterChange]);

    const addAllToCart = useCallback(async () => {
        if (!user) return navigate('/auth/login');
        try{
            await api.post('favorites/move_all_to_cart',
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            ) 
        }catch(e){
            console.log(e)
        }       
    }, [user, navigate]);
    

    const totalPrice = calculateTotalPrice(wishlist);

    return (
        <section className={`row flex-direction-column ${Style['wishlist-section']}`}>
            <div className={`row flex-direction-column width-100 align-start ${Style['intro']}`}>
                <Back className={Style.back} />
                <div className={`row width-100`}>
                    <div className={`row flex-direction-column ${Style['share-left-side']}`}>
                        <h1 className="width-100">My Wishlist</h1>
                        <p className="width-100">{number_of_wished} Books saved for later</p>
                    </div>

                    <div className={`row justify-content-center align-center ${Style['share-wishlist']}`}>
                        <button disabled={disableShareBtn} onClick={handleShare} className={`row justify-content-center`} aria-label="Share wishlist button">
                            {shareBtnSuccess || <><LuShare2 color="1A237E" size={16} /> Share Wishlist</>}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`row width-100 ${Style['filter-section']}`}>
                <p>Showing {number_of_wished} books</p>
                <div className={`row ${Style.filter}`}>
                    <select onChange={onFilterChange}>
                        <option value={'recently'}>Recently Added</option>
                        <option value={'oldest'}>Oldest First</option>
                    </select>
                    <button onClick={addAllToCart}>Add All to Cart</button>
                </div>
            </div>

            <div className={`row justify-content-start width-100 ${Style.books}`}>
                {wishlist.map((b) =>
                    <BookCard book={b.book} key={b.id} isGridDisplay={isGrid} wishlistChange={loadWishlist} />
                )}
            </div>

            <div className={`row width-100 ${Style.purchase}`}>
                <div className="row flex-direction-column align-start">
                    <h3>Ready to purchase?</h3>
                    <p>Add all items to your cart with one click</p>
                </div>
                <div className={`row`}>
                    <button className={Style.clear} onClick={clearWishlist}>Clear Wishlist</button>
                    <button className={`row ${Style['add-to-cart']}`} onClick={addAllToCart}>
                        <LuShoppingCart color="white" size={16} />
                        Add All to Cart ${totalPrice}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Wishlist;
