import Back from '../../Components/Back'
import { LuShield } from "react-icons/lu";
import Style from './cart.module.scss'
import { useCallback, useContext, useEffect, useState } from 'react';
import Confirmation from '../../Components/Alert/Confirmation';
import Notify from '../../Components/Notify/Notify';
import {CartContext} from '../../Context/CartContext';
import CartCard from '../../Components/CartCard/CartCard';

function Cart() {
    const { cart, clearCart, increment, decrement , removeFromCart} = useContext(CartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    console.log(cart);


    const calcSalary = useCallback(() =>
        setTotalPrice(cart.reduce((total, book) => total + (book.book.saleInfo.price * book.quantity), 0))
        , [cart]);

    useEffect(() =>
        calcSalary()
        , [cart, calcSalary])


    const handleCheckoutClick = useCallback(() => {
        setShowConfirm(true);
    }, []);

    const handleConfirmClose = useCallback((choice) => {
        setShowConfirm(false);
        if (choice === true) {
            setShowSuccess(true)
            clearCart()
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }
    }, [clearCart]);

    return (
        <section className={`row justify-content-center flex-direction-column ${Style.cart}`}>
            <div className={`width-100 ${Style['intro']}`}>
                <Back />
                <div className='row align-start flex-direction-column'>
                    <h1>Shopping Cart</h1>
                    <p className={Style['number-of-items']}>{cart.length} Items in your cart</p>
                </div>
            </div>

            <div className={`width-100 ${Style.order}`}>
                <section className={`row flex-direction-column align-start justify-content-start width-100 ${Style.cards}`}>
                    {
                        cart.map((book) =>
                            <CartCard book={book} removeFromCart={removeFromCart}
                                increment={increment} decrement={decrement} key={`CartCard ${book.id}`} />
                        )
                    }
                </section>

                <section className={`row flex-direction-column justify-content-center ${Style.checkout}`}>
                    <h2 className='width-100'>Order Summary</h2>
                    <div className={`row flex-direction-column width-100 ${Style.summary}`}>
                        <div className={`width-100 ${Style['promo-code']}`}>
                            <input placeholder='Enter promo code' />
                            <button>Apply</button>
                        </div>
                        <div className={Style.divider}></div>
                        <div className={`row flex-direction-column width-100 ${Style.subjects}`}>
                            <div className={`row width-100  ${Style.subject}`}>
                                <p>Subtotal</p>
                                <p>${totalPrice}</p>
                            </div>
                            <div className={`row width-100  ${Style.subject}`}>
                                <p>Saving</p>
                                <p>$0</p>
                            </div>
                            <div className={`row width-100 ${Style.subject}`}>
                                <p>Shipping</p>
                                <p>FREE</p>
                            </div>
                            <div className={`row width-100  ${Style.subject}`}>
                                <p>Tax</p>
                                <p>$0</p>
                            </div>
                        </div>
                        <div className={Style.divider}></div>
                        <div className='row width-100'>
                            <h3>Total</h3>
                            <p className={Style['total-price']}>${totalPrice}</p>
                        </div>
                    </div>
                    <div className='width-100'>
                        <button className={`${Style['proceed-button']}`} onClick={handleCheckoutClick}>Proceed to Checkout</button>
                        <div className={`row justify-content-center ${Style.feature}`}>
                            <LuShield color='#666666' size={12} />
                            <span>Secure checkout guaranteed</span>
                        </div>
                    </div>
                </section>
            </div>

            {showConfirm && <Confirmation
                message="Are you sure you want to Proceed Purchase?"
                onClose={handleConfirmClose} />
            }
            {showSuccess && <Notify
                message="Items purchased successfully!"
            />
            }
        </section>
    );
}
export default Cart;