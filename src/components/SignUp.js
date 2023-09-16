import React from 'react'
import { auth, provider} from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { validate, res } from 'react-email-validator';
import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

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


    const { handleSubmit, formState: { errors } } = useForm();







  const signInWithGoogle = async () =>{
    const result = await signInWithPopup(auth, provider);
    navigate("/SignUpPt2");
    window.location.reload();
  };

  const onSubmit = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmEmailError("");
    setConfirmPasswordError("");

    if(validate(email)){
        if(email === confirmEmail){
            if(password.length > 6){
                if(password === confirmPassword){
                    setEmailPassword([email, password]);
                    navigate("/SignUpPt2"); 
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
                        <label class = "font-bold" id = "confirmEmail">Email</label>
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

    </div>
  )
}
