import React, { useEffect, useMemo, useState } from "react";
import {UserContext} from "../Context/UserContext";

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    console.log(user);

    useEffect(() => {
        const storedUser =
            JSON.parse(localStorage.getItem("user")) ||
            JSON.parse(sessionStorage.getItem("user")) ||
            null;
        if(storedUser){
            if(Date.now() > storedUser.tokenExpiry){
                localStorage.removeItem("user");
                sessionStorage.removeItem("user");
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                setUser(null);
            }
        }    
        setUser(storedUser);
    }, []);


    useEffect(() => {
        if (user?.tokenExpiry) {
            console.log("hello")
            const remaining = user.tokenExpiry - Date.now();
            if (remaining > 0) {
                const timer = setTimeout(() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("token");
                    setUser(null);
                }, remaining);

                return () => clearTimeout(timer);
            }
        }
    }, [user]);

    const value= useMemo(() => ({ user, setUser }), [user, setUser]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
export default UserProvider;