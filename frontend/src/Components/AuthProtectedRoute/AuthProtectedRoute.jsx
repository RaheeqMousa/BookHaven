import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

function AuthProtectedRoute(){
    const {user} =useContext(UserContext);

    if(!user){
        return <Navigate to='/auth/login' />
    }
    return <Outlet/>
}
export default AuthProtectedRoute;