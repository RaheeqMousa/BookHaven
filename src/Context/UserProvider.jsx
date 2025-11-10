import React, { useEffect, useState } from "react";
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

    useEffect(() => {
        if (!user) {
            localStorage.removeItem("user") || sessionStorage.removeItem("user");
        }
    }, [user]);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
export default UserProvider;