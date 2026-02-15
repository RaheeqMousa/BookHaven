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
            
        setUser(storedUser);
    }, []);


    const value= useMemo(() => ({ user, setUser }), [user, setUser]);


    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
export default UserProvider;