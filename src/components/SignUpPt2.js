import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignUpPt2 = ({emailPassword, setEmailPassword}) => {
    const [studentNumber, setStudentNumber] = useState("");
    const [typeOfUser, setTypeOfUser] = useState("");
    const navigate = useNavigate();

    
    const onSubmit = () => {
        setEmailPassword([emailPassword[0], emailPassword[1], studentNumber, typeOfUser]);
        
        navigate("/SignUpPt2");
    }
    
  return (
    <div class = "w-[100%] h-[100%] bg-blue ">
        <div>extra info</div>
        
        <div class = "flex flex-col border w-[600px] m-auto border-black my-[50px] shadow-xl rounded-md bg-[#d1fae5] h-[400px]">

            <div class = "flex flex-col items-center mx-auto h-[100%] w-[100%] pb-5">
                <div class = "flex flex-col mt-6 w-[70%]">
                    <div class = "flex">
                        <label class = "font-bold" id = "email">Student Number (if applicable)</label>
                        <p class = "ml-6 text-red-700"></p>
                    </div>
                    
                    <input class = "px-4 py-1 rounded-xl" onChange={(e) => {setStudentNumber(e.target.value)}}></input>
                </div>

                <div class = "flex flex-col mt-6 w-[70%]">
                    <div class = "flex">
                        <label class = "font-bold" id = "confirmEmail">Type of User</label>
                        <p class = "ml-6 text-red-700"></p>
                    </div>
                    
                    <select onChange={(e) => {setTypeOfUser(e.target.value)}}>
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>

                    </select>
                </div>


                <button class = "mt-6 bg-[#AAF0D1] px-2 py-1 rounded-lg" onClick ={onSubmit}>Sign Up</button>

            </div>




        </div>

    </div>
  )
}
