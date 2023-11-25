import React from 'react'
import { useState } from 'react';
import 'react-datetime-picker/dist/DateTimePicker.css';
import {DateTimePicker} from 'react-datetime-picker';
import { useParams } from 'react-router-dom';
import { addDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';

export const FinalCheck = ({questions, title, description}) => {
    const [date, setDate] = useState();
    const {classID} = useParams();
    const [dateError, setDateError] = useState("");

    const quizDataRef = collection(db, `/Classes/${classID}/Quizzes`)

    const onSubmit = () => {

        if(date === ""){
            setDateError("Please enter a date")
            return;
        }
        if(date < (new Date())){

            setDateError("Please enter a date in the future")
            return;
        }

        addDoc(quizDataRef, {
            title,
            description,
            questions,
            date,
        }).finally(() => {
            window.location.reload();
        })


        
    }


  return (
    <div>
        <div class = "grid grid-cols-4 grid-rows-auto align-middle mt-10 gap-y-5">
            {questions.map((question, index) => {
                console.log(question.type)
                console.log(question.answers)
                if(question.type == "multipleChoice" || question.type == "fillInTheBlank"){
                    console.log("if")
                return(
                        <div class = " w-[200px] flex flex-col align-middle border-solid border-2 border-gray-400">

                                <p class = "font-bold">Question: {index + 1}</p>
                            
                                <p>{question.type}</p>
                                <div class = "flex flex-col align-middle">
                                    <p>Q: {question.question}</p>

                                    <div class = "flex-col ">
                                    
                                    <p class = "mt-2">Answers: </p>
                                    
                                    {Array.from(question.answers).map((choices) => {
                                        return(
                                            <div class = "flex flex-row align-middle">
                                                <p>{choices.value}</p>

                                                {question.type == "fillInTheBlank" ? <></> : <div>{choices.true? <p class = "text-green-400">true</p>
                                                :
                                                <p class = "text-red-400">false</p>
                                                }</div>}
                                            </div>
                                        )
                                    })}</div>
                                </div>

                        
                                
                        </div>
                        
                    )
                }
                else{
                    console.log("else")
                    return(
                        <div class = "w-[200px] flex flex-col align-middle border-solid border-2 border-gray-400">
                            <p class = "font-bold">Question: {index}</p>
                            
                                <p>{question.type}</p>
                                <div class = "flex flex-row align-middle">
                                    <p>{question.question}</p>
                                </div>

                        
                                
                        </div>
                    )
                }

            })}
        </div>

        <p class = "error">{dateError}</p>

        <div class = "flex w-[300px] mt-10">
            <DateTimePicker value = {date} class = "w-[200px]" onChange = {setDate}/>
            <button class = "ml-10 border-solid border-2 py-1 px-2" onClick = {() => {onSubmit()}}>Post</button>
        </div>
    </div>
  )
}
