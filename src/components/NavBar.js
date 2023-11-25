import React from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

//q: why is my background not black
//a: because you have a typo in your css file
//q: what line is the typo
//a: line 6
export const NavBar = () => {
    const {signedIn, setSignedIn} = React.useContext(userContext);
    const [username] = useAuthState(auth);
    const navigate = useNavigate();

    const onLogOut = () => {  
      console.log("log out")
        signOut(auth).then(() => {
          
          console.log("log out success")
          setSignedIn(false)
          navigate("/")

          }).catch((error) => {
            console.log("log out error: " + error)
          });
    }

  return (
    <div class = "left-0 right-0 h-14 bg-[#86efac] flex items-center fixed top-0 z-10">

        <div class = "text-center ml-5 font-bold text-lg">Eureka</div>
        
        {
            !username ? 
            <>
            
            <button class = "text-center justify-self-end ml-auto mr-5 rounded md py-1 px-2 bg-white shadow-lg border" onClick = {() => {navigate("/signUp")}}>Sign Up</button>
            <button class = "text-center justify-self-end mr-5 rounded-md py-1 px-2 bg-white shadow-lg border" onClick = {() => {navigate("/login")}}>Login</button>

            </>
            :
            <>
            <button class = "text-center justify-self-end ml-5 rounded md py-1 px-2 bg-white shadow-lg border" onClick = {() => {navigate("/")}}>Classes</button>
            <button class = "text-center justify-self-end ml-auto mr-5 rounded md py-1 px-2 bg-white shadow-lg border" onClick={onLogOut}>Log out</button>
            </>
        }

    </div>
  )
}


