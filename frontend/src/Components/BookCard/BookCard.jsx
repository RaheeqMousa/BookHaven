import PropTypes from 'prop-types';
import Style from './BookCard.module.scss';
import { useCallback, useMemo, useContext } from 'react';
import { CiHeart } from "react-icons/ci";
import { LuShoppingCart } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart } from "react-icons/fa6";
// import useWish from '../../Hooks/useWish';
import { joinAuthors } from '../../Utils/JoinAuthors';
import { UserContext } from '../../Context/UserContext';
import { stopLinkPropagation } from '../../Utils/stopLinkPropagation';
import {CartContext} from '../../Context/CartContext';
import { WishlistContext } from '../../Context/WishlistContext';

function BookCard(props) {
    const { book, isGridDisplay, wishlistChange, showActions = true } = props;
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const bookPrice = useMemo(() => {
        if (book.saleInfo.saleability === "FREE") 
            return 0;
        return book.price ?? Math.floor(Math.random() * 40) + 10;
    }, [book]);
    // const [wish, toggleWish] = useWish(book, bookPrice);
    const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
    const isWished = useMemo(() => {
        return wishlist?.some(item => item.book?.id === book.id);
    }, [wishlist, book.id]);

    const { addToCart } = useContext(CartContext);

    const handleWishlistClick = useCallback(
        async (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log(book)
            if (isWished) {
                const wishlistItem= wishlist.find(item=>item.id===book.id)
                console.log(wishlistItem)
                await removeFromWishlist(book.id);
            }else{
                await addToWishlist(book);
            }
            if (wishlistChange) 
                wishlistChange();
        },
        [wishlistChange, isWished, book, wishlist, addToWishlist, removeFromWishlist]
    );

    const addToCartHandler = useCallback((book) => 
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!user) {
                navigate('/auth/login');
                return;
            }
            addToCart(book, bookPrice);
            navigate('/user/cart');
        },
        [addToCart, bookPrice, navigate, user]
    );

    return (
        <Link
            to={`/bookdetails/${book.id}`}
            state={book}
            className={`${isGridDisplay ? '' : Style['list-display']} ${Style['book-card']}`}
        >
            <div className={Style['book-cover']}>
                <img
                    src={
                        book.volumeInfo.imageLinks?.smallThumbnail ||
                        book.volumeInfo.imageLinks?.thumbnail
                    }
                    alt={book.volumeInfo.title}
                    title={book.volumeInfo.title}
                    width={168}
                    height={180}
                />

                {showActions && (
                    <>
                        {book.saleInfo.saleability === "FREE" && <p className={Style.free}>FREE</p>}
                        <button
                            aria-label='Add to wishlist button'
                            onClick={handleWishlistClick}
                            className={`row justify-content-center ${Style.wishlist}`}
                        >
                            {!isWished ? <CiHeart size={16} /> : <FaHeart size={16} color='red' />}
                        </button>
                    </>
                )}

                {showActions && (
                    <div className={`row ${Style['quick-add-wrapper']}`}>
                        <div className={`row ${Style['buttons-wrapper']}`}>
                            <button
                                className={`row justify-content-center ${Style['quick-add']}`}
                                onClick={addToCartHandler(book)}
                            >
                                <LuShoppingCart size={16} />
                                Quick Add
                            </button>
                            <a
                                href={book.volumeInfo.previewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`row justify-content-center ${Style['preview']}`}
                                onClick={stopLinkPropagation}
                            >
                                Preview
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <div className={`row flex-direction-column ${Style.info}`}>
                {book.volumeInfo.categories?.map((cat, index) => (
                    <p className={Style.category} key={index}>
                        {cat}
                    </p>
                ))}

                <div className={Style.titles}>
                    <h3>{book.volumeInfo.title}</h3>
                    <p className={Style['book-subtitle']}>
                        {book.volumeInfo.subtitle || ''}
                    </p>
                    <p>
                        {book.volumeInfo.authors
                            ? `by ${joinAuthors(book.volumeInfo.authors)}`
                            : ''}
                    </p>
                </div>

                <span className={Style['book-availability']}>
                    <strong
                        className={
                            book.saleInfo.saleability === "FREE"
                                ? Style['buy-free']
                                : ''
                        }
                    >
                        {book.saleInfo.saleability}
                    </strong>
                    <p>
                        {book.volumeInfo.pageCount
                            ? `${book.volumeInfo.pageCount} pages`
                            : ''}
                    </p>
                </span>
            </div>
        </Link>
    );
}

const volumeInfoShape = PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.string),
    printType: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    pageCount: PropTypes.number,
    description: PropTypes.string,
    previewLink: PropTypes.string,
    imageLinks: PropTypes.shape({
        smallThumbnail: PropTypes.string,
        thumbnail: PropTypes.string,
    }),
});

const saleInfoShape = PropTypes.shape({
    saleability: PropTypes.string,
    listPrice: PropTypes.shape({
        amount: PropTypes.number,
        currencyCode: PropTypes.string,
    }),
});

const accessInfoShape = PropTypes.shape({
    webReaderLink: PropTypes.string,
});

BookCard.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.string.isRequired,
        volumeInfo: volumeInfoShape,
        saleInfo: saleInfoShape,
        accessInfo: accessInfoShape,
        price: PropTypes.number,
    }).isRequired,
    isGridDisplay: PropTypes.bool,
    wishlistChange: PropTypes.func,
    showActions: PropTypes.bool,
};

export default BookCard;