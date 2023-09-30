import React from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { useContext } from "react";

//q: why is my background not black
//a: because you have a typo in your css file
//q: what line is the typo
//a: line 6
export const NavBar = () => {
    const {signedIn} = React.useContext(userContext);

  return (
    <div class = "w-[100%] h-14 bg-[#86efac] flex items-center">

        <div class = "text-center ml-5 font-bold text-lg">Eureka</div>
        
        {
            !signedIn ? 
            <>
            
            <button class = "text-center justify-self-end ml-auto mr-5 rounded md py-1 px-2 bg-white shadow-lg border"><Link to = "/signUp">Sign Up</Link></button>
            <button class = "text-center justify-self-end mr-5 rounded-md py-1 px-2 bg-white shadow-lg border"><Link to = "/login">Login</Link></button>

            </>
            :
            <>
            <button class = "text-center justify-self-end ml-5 rounded md py-1 px-2 bg-white shadow-lg border">Classes</button>
            <button class = "text-center justify-self-end ml-auto mr-5 rounded md py-1 px-2 bg-white shadow-lg border">Log out</button>
            </>
        }

    </div>
  )
}


