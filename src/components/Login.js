import React, { useEffect } from 'react'
import { useState } from 'react'
import { auth, provider, db} from './firebase';
import { reload, signInWithPopup } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, where} from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { useContext } from '../App';
import { userContext } from '../App';

export const Login = ({emailPassword, setEmailPassword}) => {
  const {setSignedIn} = React.useContext(userContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const {userQuerySnapshot} = React.useContext(userContext);
  const {getQuery} = React.useContext(userContext);

  const checkData = async (email) => {
    try {
      await getQuery();
      console.log(userQuerySnapshot);
      
      if (userQuerySnapshot.size === 1) {
        if(userQuerySnapshot.docs[0].data().hasOwnProperty("studentNumber") || userQuerySnapshot.docs[0].data().hasOwnProperty("teacherNumber")){

        console.log("User with email with additional data");
        setSignedIn(true)
        navigate("/Home");
        } 
        else{

          setEmailPassword([email, password]);
          navigate("/SignUpPt2")
        }
      }
      else if (userQuerySnapshot.size > 1) {
        console.log("Error: Multiple users exist with the same email address:");
      }
      else {
        console.log(userQuerySnapshot.docs[0].data());
        console.log("User with email does not exist:");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }
  



  const signInWithGoogle = async () =>{
    
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      checkData(user.email)
      console.log(auth.currentUser)
      console.log(auth.currentUser.emailVerified);
      
    
  };

  const onSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        checkData(email);


      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorCode === "auth/wrong-password"){
          setPasswordError("Wrong password");
        }
        if(errorCode === "auth/invalid-email"){
          setEmailError("Invalid email");
        }

        console.log(errorCode);
        console.log(errorMessage);
      });
  }
  return (
    <div class = "w-[100%] h-[100%] bg-blue">

<div class = "flex flex-col border w-[600px] m-auto border-black my-[50px] shadow-xl rounded-md bg-[#d1fae5] h-[700px]">

<div class = "flex flex-col items-center mx-auto border border-b-[#47cc90] h-[70%] w-[100%] pb-5">
    <div class = "flex flex-col mt-6 w-[70%]">
        <div class = "flex">
            <label class = "font-bold" id = "email">Email</label>
            <p class = "ml-6 text-red-700">{emailError}</p>
        </div>
        
        <input class = "px-4 py-1 rounded-xl" placeholder='Email' onChange={(e) => {setEmail(e.target.value)}}></input>
    </div>


    <div class = "flex flex-col mt-6 w-[70%]">
        <div class = "flex">
            <label class = "font-bold" id = "password">Password</label>
            <p class = "ml-6 text-red-700">{passwordError}</p>
        </div>
        
        <input class = "px-4 py-1 rounded-xl" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}></input>
    </div>

    <button class = "mt-6 bg-[#AAF0D1] px-2 py-1 rounded-lg" onClick = {onSignIn}>Sign Up</button>

</div>

<div class= "flex flex-col items-center ">
    <div class= 'my-5'>Sign in with Google instead</div>

    <button class='login-button' onClick = {signInWithGoogle}>Login</button>


</div>


</div>

    </div>
  )
}
