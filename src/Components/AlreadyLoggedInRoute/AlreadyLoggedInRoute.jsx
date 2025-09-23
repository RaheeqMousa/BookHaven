import { Navigate, Outlet } from "react-router-dom";
function AlreadyLoggedInRoute(){
    const token = localStorage.getItem('user') || sessionStorage.getItem('user');
    if(token){
        return <Navigate to='/' />
    }

    return <Outlet />;
}
export default AlreadyLoggedInRoute;