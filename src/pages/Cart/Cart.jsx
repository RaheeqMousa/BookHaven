import Back from '../../Components/Back'
import { LuShield } from "react-icons/lu";
import Style from './cart.module.scss'
import { useEffect, useState } from 'react';
import { FiTrash2 } from "react-icons/fi";
import { joinAuthors } from '../../Utils/JoinAuthors';
import ShippingImg from '../../assets/Images/shipping_cart.svg'
import { GoPlus } from "react-icons/go";
import { TiMinus } from "react-icons/ti";

function Cart() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        try {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const user = JSON.parse(localStorage.getItem('user'));
            const userCart = storedCart.filter(w => w.userId === user.id);

            if (userCart) {
                setItems(userCart);
                console.log(userCart);
            } else {
                setItems([]);
            }
        } catch (e) {
            console.error(e);
            setItems([]);
        }
    }, []);


    return (
        <section className={`row judtify-content-center flex-direction-column ${Style.cart}`}>
            <div className={`width-100 ${Style['intro']}`}>
                <Back />
                <div className='row align-start flex-direction-column'>
                    <h1>Shopping Cart</h1>
                    <p className={Style['number-of-items']}>{items.length} Items in your cart</p>
                </div>
            </div>

            <div className={`width-100 ${Style.order}`}>
                <section className={`row flex-direction-column align-start justify-content-start width-100 ${Style.cards}`}>
                    {
                        items.map((book) =>
                            <div className={`row width-100 ${Style['cart-card']}`} id={book.id}>
                                <img src={book.volumeInfo.imageLinks?.smallThumbnail || book.volumeInfo.imageLinks?.thumbnail}
                                    alt={book.volumeInfo.title} title={book.volumeInfo.title}
                                    width={80} height={112}
                                    className={Style['book-cover']}
                                />
                                <div className={`row flex-direction-column ${Style['card-info']}`}>
                                    <div className='row width-100'>
                                        <div className={`row flex-direction-column align-start ${Style.info}`}>
                                            <h3>{book.volumeInfo.title}</h3>
                                            <p>{book.volumeInfo.authors ? `by  ${joinAuthors(book.volumeInfo.authors)}` : ''}</p>
                                            {book.volumeInfo.categories &&
                                                book.volumeInfo.categories.map((cat, index) =>
                                                    (<p className={Style.category} key={index}>{cat}</p>))
                                            }
                                        </div>
                                        <FiTrash2 color='#666666' size={16} />
                                    </div>
                                    <div className={`row width-100`}>
                                        <p className={Style.price}>${book.saleInfo.price * book.quantity}</p>
                                        <div className={`row ${Style['quantity']}`}>
                                            <button className={`row justify-content-center ${Style.decr}`}><TiMinus size={16} color='#6666' /></button>
                                            <p className='row justify-content-center'>{book.quantity}</p>
                                            <button className={`row justify-content-center ${Style.incr}`}><GoPlus size={16} color='black' /></button>
                                        </div>
                                    </div>
                                    <div className={`row justify-content-start width-100 ${Style.shipping}`}>
                                        <img src={ShippingImg} width={12} height={12} alt='' title='Shipping Image' />
                                        <p>Estimated delivery: 2-3 business days</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </section>

                <section className={`row flex-direction-column justify-content-center ${Style.checkout}`}>
                    <h2 className='width-100'>Order Summary</h2>
                    <div className={`row flex-direction-column ${Style.summary}`}>
                        <div className={`${Style['promo-code']}`}>
                            <input placeholder='Enter promo code' />
                            <button>Apply</button>
                        </div>
                        <div className={Style.divider}></div>
                        <div className={`row flex-direction-column ${Style.subjects}`}>
                            <div className={`row ${Style.subject}`}>
                                <p>Subtotal</p>

                            </div>
                            <div className={`row ${Style.subject}`}>
                                <p>Saving</p>

                            </div>
                            <div className={`row ${Style.subject}`}>
                                <p>Shipping</p>

                            </div>
                            <div className={`row ${Style.subject}`}>
                                <p>Tax</p>

                            </div>
                        </div>
                        <div className={Style.divider}></div>
                        <div className='row width-100'>
                            <h3>Total</h3>
                            <p>$150</p>
                        </div>
                    </div>
                    <div className='width-100'>
                        <button className={`${Style['proceed-button']}`}>Proceed to Checkout</button>
                        <div className={`row justify-content-center ${Style.feature}`}>
                            <LuShield color='#666666' size={12} />
                            <span>Secure checkout guaranteed</span>
                        </div>
                    </div>
                </section>
            </div>

        </section>
    );
}
export default Cart;