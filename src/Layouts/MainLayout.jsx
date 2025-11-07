import Navbar from '../Components/Navbar/Navbar'
import { Outlet } from 'react-router-dom';
import ThemeMode from '../Components/ThemeMode/ThemeMode';
function MainLayout(){
return (
    <>
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
            <ThemeMode />
    </>
    );
}
export default MainLayout;
