import { joinAuthors } from '../../Utils/JoinAuthors';
import Style from './CartCard.module.scss';
import { FiTrash2 } from "react-icons/fi";
import ShippingImg from '../../assets/Images/shipping_cart.svg'
import { GoPlus } from "react-icons/go";
import { TiMinus } from "react-icons/ti";
import { useCallback } from 'react';


function CartCard({book, removeFromCart, increment, decrement}) {
    console.log(book)

    const decrementHandler = useCallback(() =>
            decrement(book.item_id)
    ,[decrement,book.item_id]);

    const incrementHandler = useCallback(() =>
            increment(book.item_id)
    ,[increment,book.item_id]);

    const getDeleteHandler = useCallback(() =>
            removeFromCart(book.item_id)
    ,[removeFromCart,book.item_id]);

    return (
        <div className={`row width-100 ${Style['cart-card']}`} >
            <img src={book.book.volumeInfo.imageLinks?.smallThumbnail || book.book.volumeInfo.imageLinks?.thumbnail}
                alt={book.book.volumeInfo.title} title={book.book.volumeInfo.title}
                width={80} height={112}
                loading="lazy"
                className={Style['book-cover']}
            />
            <div className={`row flex-direction-column ${Style['card-info']}`}>
                <div className='row width-100'>
                    <div className={`row flex-direction-column align-start ${Style.info}`}>
                        <h3>{book.book.volumeInfo.title}</h3>
                        <p>{book.book.volumeInfo.authors ? `by  ${joinAuthors(book.book.volumeInfo.authors)}` : ''}</p>
                        {book.book.volumeInfo.categories &&
                            book.book.volumeInfo.categories.map((cat, index) =>
                                (<p className={Style.category} key={index}>{cat}</p>))
                        }
                    </div>
                    <button onClick={getDeleteHandler} className={Style.delete} aria-label='Delete book from cart button'>
                        <FiTrash2 color='#666666' size={16} />
                    </button>

                </div>
                <div className={`row width-100`}>
                    <p className={Style.price}>${book.book.saleInfo.price * book.quantity}</p>
                    <div className={`row ${Style['quantity']}`}>
                        <button className={`row justify-content-center ${Style.decr}`} disabled={book.quantity <= 1} onClick={decrementHandler} aria-label='Decrement book quantity'>
                            <TiMinus size={16} color='#6666' />
                        </button>
                        <p className='row justify-content-center'>{book.quantity}</p>
                        <button className={`row justify-content-center ${Style.incr}`} onClick={incrementHandler} aria-label='Increment book quantity'>
                            <GoPlus size={16} color='black' />
                        </button>
                    </div>
                </div>
                <div className={`row justify-content-start width-100 ${Style.shipping}`}>
                    <img src={ShippingImg} width={12} height={12} alt='shipping image' title='Shipping Image' />
                    <p>Estimated delivery: 2-3 business days</p>
                </div>
            </div>
        </div>
    );
}
export default CartCard;