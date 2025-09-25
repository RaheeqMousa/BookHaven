import PropTypes from 'prop-types';
import Style from './BookCard.module.scss'
import { useCallback } from 'react';
import { CiHeart } from "react-icons/ci";
import { LuShoppingCart } from "react-icons/lu";
import { Link } from 'react-router-dom'
import { FaHeart } from "react-icons/fa6";
import useWish from '../../Hooks/useWish';
import { joinAuthors } from '../../Utils/JoinAuthors';
import { useMemo } from 'react';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { stopLinkPropagation } from '../../Utils/stopLinkPropagation';

function BookCard(props) {

    const { user } = useContext(UserContext);
    const { book, isGridDisplay, wishlistChange, showActions = true } = props;
    const bookPrice = useMemo(() => {
        const price =
            book.price ?? Math.floor(Math.random() * 40) + 10;
        return price;
    }, [book]);
    const [wish, toggleWish] = useWish(book, bookPrice);
    const navigate = useNavigate();


    const handleWishlistClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleWish();
            if (wishlistChange) wishlistChange();
        },
        [toggleWish, wishlistChange]
    );

    const addToCart = useCallback((book) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }

        let cart = localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [];

        const existingBookIndex = cart.findIndex(b => b.id === book.id && b.userId === user.id);

        if (existingBookIndex !== -1) {
            cart[existingBookIndex].quantity += 1;
        } else {
            cart.push({
                userId: user.id,
                id: book.id,
                addedAt: new Date().toISOString(),
                saleInfo: {
                    saleability: book.saleInfo.saleability,
                    price: book.saleInfo.listPrice?.amount || bookPrice,
                },
                volumeInfo: {
                    title: book.volumeInfo.title,
                    subtitle: book.volumeInfo.subtitle || "",
                    authors: book.volumeInfo.authors || [],
                    printType: book.volumeInfo.printType,
                    categories: book.volumeInfo.categories || [],
                    pageCount: book.volumeInfo.pageCount,
                    description: book.volumeInfo.description,
                    imageLinks: {
                        smallThumbnail: book.volumeInfo.imageLinks?.smallThumbnail || "",
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
                    },
                },
                accessInfo: {
                    webReaderLink: book.accessInfo.webReaderLink
                },
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        navigate('/user/cart')
    }, [user, bookPrice, navigate]);

    const addToCartHandler = useCallback((book) =>
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            addToCart(book);
        }
        , [addToCart])


    return (
        <Link
            to="/bookdetails"
            state={book}
            className={`${isGridDisplay ? '' : Style['list-display']} ${Style['book-card']}`}
        >
            <div className={Style['book-cover']}>
                <img
                    src={book.volumeInfo.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail}
                    alt={book.volumeInfo.title}
                    title={book.volumeInfo.title} width={168} height={180}
                />
                <div className={showActions ? 'display-block' : 'display-none'}>
                    {book.saleInfo.saleability === "FREE" ? <p className={Style.free}>FREE</p> : ''}
                    <button aria-label='Add to wishlist button' onClick={handleWishlistClick} className={`row justify-content-center ${Style.wishlist}`}>
                        {
                            !wish ?
                                <CiHeart size={16} /> :
                                <FaHeart size={16} color='red' />
                        }
                    </button>
                </div>
                <div className={showActions ? 'display-block' : 'display-none'}>
                    <p className={Style.printype}>{book.volumeInfo.printType}</p>
                    <div className={`row ${Style['quick-add-wrapper']}`}>
                        <div className={`row ${Style['buttons-wrapper']}`}>
                            <button className={`row justify-content-center ${Style['quick-add']}`} onClick={addToCartHandler(book)}>
                                <LuShoppingCart size={16} /> Quick Add

                            </button>
                            <a href={book.volumeInfo.previewLink} target="_blank" rel="noopener noreferrer"
                             className={`row justify-content-center ${Style['preview']}`} onClick={stopLinkPropagation}>
                                Preview
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`row flex-direction-column ${Style.info}`}>
                {book.volumeInfo.categories &&
                    book.volumeInfo.categories.map((cat, index) =>
                        (<p className={Style.category} key={index}>{cat}</p>))
                }

                <div className={Style.titles}>
                    <h3>{book.volumeInfo.title}</h3>
                    <p className={`${Style['book-subtitle']}`}>
                        {`${book.volumeInfo.subtitle ? book.volumeInfo.subtitle : ''} `}
                    </p>
                    <p>{book.volumeInfo.authors ? `by  ${joinAuthors(book.volumeInfo.authors)}` : ''}</p>
                </div>

                <span className={`${Style['book-availability']}`}>
                    <strong className={book.saleInfo.saleability === "FREE" ? Style['buy-free'] : ''} >
                        {book.saleInfo.saleability}
                    </strong>
                    <p>{book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : ''}</p>
                </span>
            </div>


        </Link >
    );
}

BookCard.propTypes = {
    book: PropTypes.shape({
        imageLink: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        printType: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        saleability: PropTypes.string.isRequired,
        pageCount: PropTypes.number.isRequired,
    }),
    isGridDisplay: PropTypes.bool.isRequired
};
export default BookCard;