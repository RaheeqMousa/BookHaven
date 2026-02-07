import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

function AlreadyLoggedInRoute(){
    const {user} =useContext(UserContext);
    if(user){
        return <Navigate to='/' />
    }

    return <Outlet />;
}
export default AlreadyLoggedInRoute;