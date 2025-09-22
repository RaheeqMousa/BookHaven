import { Navigate, Outlet } from "react-router-dom";
function AuthProtectedRoute(){
    const token= localStorage.getItem('user') || sessionStorage.getItem('user');
    if(!token){
        return <Navigate to='/auth/login' />
    }
    return <Outlet/>
}
export default AuthProtectedRoute;