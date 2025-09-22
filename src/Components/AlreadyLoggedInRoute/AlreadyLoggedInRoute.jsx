import { Navigate, Outlet } from "react-router-dom";
function AlreadyLoggedInRoute(){
    const token = localStorage.getItem('user');
    if(token){
        return <Navigate to='/auth/profile' />
    }

    return <Outlet />;
}
export default AlreadyLoggedInRoute;