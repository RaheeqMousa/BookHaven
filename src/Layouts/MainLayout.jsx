import Navbar from '../Components/Navbar/Navbar'
import { Outlet } from 'react-router-dom';
import { BooksProvider } from "../Context/BooksProvider";
import ThemeMode from '../Components/ThemeMode/ThemeMode';
function MainLayout(){
return (
        <BooksProvider>
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
            <ThemeMode />
        </BooksProvider>
    );
}
export default MainLayout;
