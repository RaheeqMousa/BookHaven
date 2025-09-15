import ProfileImg from '../../assets/Images/profile.svg'
import WishlistImg from '../../assets/Images/wishlist.svg'
import CartImg from '../../assets/Images/cart.svg'
import Style from './Navbar.module.scss'
import SearchBar from '../SearchBar/SearchBar'

function Navbar(){

    return(
        <header className='flex'>
            <div className='row'>
                <img src='/logo.png' width={32} height={32} />
                <h1>BookHaven</h1>
            </div>
            <div className='row'>
                <SearchBar />
            </div>
            <div className='row'>
                <button aria-label='Wishlist button'>
                    <img src={WishlistImg} width={16} height={16} />
                </button>
                <button aria-label='Cart button'>
                    <img src={CartImg} width={16} height={16} />
                </button>
                <button aria-label='profile button'>
                    <img src={ProfileImg} width={16} height={16} />
                </button>
            </div>
        </header>
    );
}
export default Navbar;