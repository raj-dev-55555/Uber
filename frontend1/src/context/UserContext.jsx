import React, { useState } from "react";
import { createContext } from "react";

 export const UserDataContext = createContext()  //Login ke baad user ki information Context me store kar doge:Ab Home, Navbar, Profile kisi bhi component me:


function UserContext({children}){
     const [user, setUser ]= useState({
        email: '',
        fullName: {
            firstName: '',
            lastName: ''
        }
    })
    return(
        <>
        
        <UserDataContext.Provider value={{user, setUser} }>
            {children}
        </UserDataContext.Provider>
        
        </>
    )
}

export default UserContext