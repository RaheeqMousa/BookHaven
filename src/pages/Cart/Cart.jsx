import Back from '../../Components/Back'
import { LuShield } from "react-icons/lu";
import Style from './cart.module.scss'
function Cart() {

    return (
        <section className={`row judtify-content-center flex-direction-column ${Style.cart}`}>
            <div className={`width-100 ${Style['intro']}`}>
                <Back />
                <div className='row align-start flex-direction-column'>
                    <h1>Shopping Cart</h1>
                    <p>3 Items in your cart</p>
                </div>
            </div>

            <div className={Style.order}>
                <section>

                </section>

                <section className={Style.checkout}>
                    <div>
                        <h2>Order Summary</h2>
                        <div>
                            <input placeholder='Enter promo code' />
                            <button>Apply</button>
                        </div>
                    </div>
                    <div>
                        <p>Subtotal</p>
                        <p>Savings</p>
                        <p>Shipping</p>
                        <p>Tax</p>
                    </div>
                    <div>
                        <div>
                            <h3>Total</h3>
                            <p>$150</p>
                        </div>
                        <button>Proceed to Checkout</button>
                        <div>
                            <LuShield color='#666666' size={16} />
                            <span>Secure checkout guaranteed</span>
                        </div>
                    </div>
                </section>
            </div>

        </section>
    );
}
export default Cart;