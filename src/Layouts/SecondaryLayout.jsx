import Navbar from '../Components/Navbar/Navbar'
import { Outlet } from 'react-router-dom';
import { BooksProvider } from "../Context/BooksProvider";
import ThemeMode from '../Components/ThemeMode/ThemeMode';
function MainLayout() {
    return (
        <>
            <Outlet />
            <ThemeMode />
        </>
    );
}
export default MainLayout;
