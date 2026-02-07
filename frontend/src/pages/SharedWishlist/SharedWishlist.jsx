
import BookCard from "../../Components/BookCard/BookCard";
import { useParams } from "react-router-dom";
import Style from './SharedWishlist.module.scss';
import Back from "../../Components/Back";
import useWishlist from "../../Hooks/useWishlist";

function SharedWishlist() {

    const { id } = useParams();
    const {wishlist}= useWishlist(id)

    return (
        <section className={`row justify-content-center flex-direction-column `}>
            <div className={`row justify-content-center ${Style['shared-books']} `}>
                <div className="width-100">
                    <Back className="align-self-start" />
                    <h1>Items shared by your friend</h1>
                </div>
                <div className={`row justify-content-center flex-direction-column ${Style.books}`}>
                    {wishlist.map((book) =>
                        <BookCard book={book} key={book.id} isGridDisplay={false} showActions={false} />
                    )
                    }
                </div>
            </div>

        </section>
    );
}
export default SharedWishlist;