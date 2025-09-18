import ProfileImg from '../../assets/Images/profile.svg'
import WishlistImg from '../../assets/Images/wishlist.svg'
import CartImg from '../../assets/Images/cart.svg'
import Style from './Navbar.module.scss'
import SearchBar from '../SearchBar/SearchBar'
import { Link } from 'react-router-dom'

function Navbar() {

    return (
        <header className='row justify-content-center'>
            <div className={`row container ${Style['header-container']}`}>
                <div className='row'>
                    <img src='/logo.png' width={32} height={32} alt='Book Haven logo' title='Book Haven logo' />
                    <h1>BookHaven</h1>
                </div>
                <div className={`row justify-content-center ${Style.search}`}>
                    <SearchBar />
                </div>
                <div className='row'>
                    <Link aria-label='Wishlist button' className='row justify-content-center' to='/user/wishlist'>
                        <img src={WishlistImg} width={16} height={16} alt='Wishlist button' title='Wishlist button' />
                    </Link>
                    <Link aria-label='Cart button' className='row justify-content-center' to='/user/wishlist'>
                        <img src={CartImg} width={16} height={16}alt='Cart button' title='Cart button' />
                    </Link>
                    <Link aria-label='profile button' className='row justify-content-center' to='/user/wishlist'>
                        <img src={ProfileImg} width={16} height={16} alt='profile button' title='profile button'/>
                    </Link>
                </div>
            </div>
        </header>
    );
}
export default Navbar;