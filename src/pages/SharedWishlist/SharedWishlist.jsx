import { useState, useEffect } from "react";
import BookCard from "../../Components/BookCard/BookCard";
import { useParams } from "react-router-dom";
import Style from './SharedWishlist.module.scss';
import Back from "../../Components/Back";

function SharedWishlist() {

    const { id } = useParams();
    const [items, setItems] = useState([]);

    useEffect(() => {
        try {
            const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const userWish = storedWishlist.filter(w => w.userId === id);

            if (userWish) {
                setItems(userWish);
            } else {
                setItems([]);
            }
        } catch (e) {
            console.error(e);
            setItems([]);
        }
    }, [id]);


    return (
        <section className={`row justify-content-center flex-direction-column `}>
            <div className={`row justify-content-center ${Style['shared-books']} `}>
                <div className="width-100">
                    <Back className="align-self-start" />
                    <h1>Items shared by your friend</h1>
                </div>
                <div className={`row justify-content-center flex-direction-column ${Style.books}`}>
                    {items.map((book) =>
                        <BookCard book={book} key={book.id} isGridDisplay={false} showActions={false} />
                    )
                    }
                </div>
            </div>

        </section>
    );
}
export default SharedWishlist;