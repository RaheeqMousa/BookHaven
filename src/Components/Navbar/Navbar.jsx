import ProfileImg from '../../assets/Images/profile.svg'
import WishlistImg from '../../assets/Images/wishlist.svg'
import CartImg from '../../assets/Images/cart.svg'
import Style from './Navbar.module.scss'
import SearchBar from '../SearchBar/SearchBar'
import { Link } from 'react-router-dom'
import { useCallback, useContext } from 'react'
import { UserContext } from '../../Context/UserContext'
import { resetFbSdk } from '../../Utils/facebooksdk'

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    console.log(user);

    const logout = useCallback(() => {
        setUser(null);

        if (window.FB) {
            window.FB.logout(() => console.log("Logged out from Facebook"));
        }

        const fbScript = document.getElementById("facebook-jssdk");
        if (fbScript) fbScript.remove();

        resetFbSdk();
    }, [setUser]);

    const logoutHandler = useCallback(() =>
        logout()
        , [logout]);

    return (
        <header className='row justify-content-center'>
            <div className={`row container ${Style['header-container']}`}>
                <div className='row'>
                    <img src='/logo.png' width={32} height={32} alt='Book Haven logo' title='Book Haven logo' />
                    <h1 className={Style['navbar-title']}>BookHaven</h1>
                </div>
                <div className={`row justify-content-center ${Style.search}`}>
                    <SearchBar />
                </div>
                <div className='row'>
                    <Link aria-label='Wishlist button' className={`row justify-content-center ${Style['navbar-link']}`} to='/user/wishlist'>
                        <img src={WishlistImg} width={16} height={16} alt='Wishlist button' title='Wishlist button' />
                    </Link>
                    <Link aria-label='Cart button' className={`row justify-content-center ${Style['navbar-link']}`} to='/user/cart'>
                        <img src={CartImg} width={16} height={16} alt='Cart button' title='Cart button' />
                    </Link>
                    {
                        !user ?
                            (
                                <Link aria-label='profile button' className={`row justify-content-center ${Style['navbar-link']}`} to='/auth/login'>
                                    <img src={ProfileImg} width={16} height={16} alt='profile button' title='profile button' />
                                </Link>) : (
                                <div className={`row ${Style.logout}`}>
                                    <button onClick={logoutHandler} className='row justify-content-center bold'>
                                        logout
                                    </button>
                                </div>
                            )
                    }

                </div>
            </div>
        </header>
    );
}
export default Navbar;