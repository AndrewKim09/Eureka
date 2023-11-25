import React from 'react'
import { auth, provider} from './firebase';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { validate} from 'react-email-validator';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { db } from './firebase';
import { setDoc } from 'firebase/firestore';
import { EmailVerify } from './EmailVerify';

export const SignUp = ({setEmailPassword}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmEmailError, setConfirmEmailError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [verifying, setVerifying] = useState(false)

    const auth = getAuth();

    let result;


    const signInWithGoogle = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          
          const user = result.user;
    
          await sendEmailVerification(user);
    
          // Update user's email verification status
          await auth.updateCurrentUser({
            emailVerified: false,
          });
          
    
          window.location.reload();
          
        } catch (error) {
          console.log(error);
        }
      };

  const onSubmit = async () => {
    setEmailError("");
    setPasswordError("");
    setConfirmEmailError("");
    setConfirmPasswordError("");

    if(validate(email)){
        if(email === confirmEmail){
            if(password.length > 6){
                if(password === confirmPassword){
                    try{
                        const newUserCredentials = await createUserWithEmailAndPassword(auth, email, password)

                        const userProfileDocRef = doc(db, `users/${newUserCredentials.user.uid}`)

                        await setDoc(userProfileDocRef, {email})
                        
                        await sendEmailVerification(newUserCredentials.user)
                        
                        auth.updateCurrentUser(newUserCredentials.uid , {
                            emailVerified: false
                        })
                        
                        

                        setVerifying(true)
                    }
                    catch(e){  
                        
                        if(e.code === 'auth/email-already-in-use'){
                            setEmailError("this email already exists!")
                        }
                        else{
                            alert(e)
                        }
                        
                    }
                }
                else{
                    setConfirmPasswordError("Passwords do not match");
                }
            }
            else{
                setPasswordError("Password must be at least 6 characters");
            }
        }
        else{
            setConfirmEmailError("Emails do not match");
        }
    }
    else{
        setEmailError("Invalid Email");
    }
  }


  return (
    <div class = "w-[100%] h-[100%] bg-blue ">
        { !verifying ? 
            <div class = "flex flex-col border w-[600px] m-auto border-black my-[50px] shadow-xl rounded-md bg-[#d1fae5] h-[700px]">

            <div class = "flex flex-col items-center mx-auto border border-b-[#47cc90] h-[auto] w-[100%] pb-5">
                <div class = "flex flex-col mt-6 w-[70%]">
                    <div class = "flex">
                        <label class = "font-bold" id = "email">Email</label>
                        <p class = "ml-6 text-red-700">{emailError}</p>
                    </div>
                    
                    <input class = "px-4 py-1 rounded-xl" placeholder='Email' onChange={(e) => {setEmail(e.target.value)}}></input>
                </div>

                <div class = "flex flex-col mt-6 w-[70%]">
                    <div class = "flex">
                        <label class = "font-bold" id = "confirmEmail">Confirm Email</label>
                        <p class = "ml-6 text-red-700">{confirmEmailError}</p>
                    </div>
                    
                    <input class = "px-4 py-1 rounded-xl" placeholder='Confirm Email' onChange={(e) => {setConfirmEmail(e.target.value)}}></input>
                </div>

                <div class = "flex flex-col mt-6 w-[70%]">
                    <div class = "flex">
                        <label class = "font-bold" id = "password">Password</label>
                        <p class = "ml-6 text-red-700">{passwordError}</p>
                    </div>
                    
                    <input class = "px-4 py-1 rounded-xl" placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}></input>
                </div>

                <div class = "flex flex-col mt-6 w-[70%]">
                    <div class = "flex">
                        <label class = "font-bold" id = "confirmPassword">Confirm Password</label>
                        <p class = "ml-6 text-red-700">{confirmPasswordError}</p>
                    </div>
                    
                    <input class = "px-4 py-1 rounded-xl" placeholder='Confirm Password' onChange={(e) => {setConfirmPassword(e.target.value)}}></input>
                </div>

                <button class = "mt-6 bg-[#AAF0D1] px-2 py-1 rounded-lg" onClick={onSubmit}>Sign Up</button>

            </div>

            <div class= "flex flex-col items-center ">
                <div class= 'my-5'>Sign up with Google instead</div>

                <button class='login-button' onClick = {signInWithGoogle}>Login</button>


            </div>


        </div>
        
        :
        <div>
            {navigate("/emailVerify")}
        </div>
    }

    </div>
  )
}
