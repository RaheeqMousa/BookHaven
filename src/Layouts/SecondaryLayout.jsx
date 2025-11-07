import Navbar from '../Components/Navbar/Navbar'
import { Outlet } from 'react-router-dom';
import ThemeMode from '../Components/ThemeMode/ThemeMode';


function SecondaryLayout() {
    return (
        <>
            <Outlet />
            <ThemeMode />
        </>
    );
}
export default SecondaryLayout;
