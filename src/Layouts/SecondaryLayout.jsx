import Navbar from '../Components/Navbar/Navbar'
import { Outlet } from 'react-router-dom';
import { BooksProvider } from "../Context/BooksProvider";

function MainLayout(){
return (
        <Outlet />
    );
}
export default MainLayout;
