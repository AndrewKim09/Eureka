import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addDoc, getDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { set } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase'
import { collection } from 'firebase/firestore'
import { auth } from '../firebase'

export const QuizStart = ({questions}) => {
    const [name, setName] = useState(null)
    const navigate = useNavigate();
    const {quizID, classID} = useParams();
    const[index, setIndex] = useState(1)
    const[answers, setAnswers] = useState([])
    const[collapseQuestions, setCollapseQuestions] = useState(false)
    const[confirm, setConfirm] = useState(false)
    const quizAnswersDataRef = collection(db, `/Classes/${classID}/Quizzes/${quizID}/Answers`)

    const onNextQuestion = () => {
        if(index === questions.length){
            return
        }
        setIndex(index + 1)
    }

    const onPreviousQuestion = () => {
        if(index === 1){
            return
        }
        setIndex(index - 1)
    }


    const toggleRadio = (event, choiceIndex) => {
        const radioInput = event.currentTarget.querySelector('input[type="radio"]');
        if (radioInput) {
            radioInput.checked = true;
        }
        setMultipleChoiceAnswer(event, choiceIndex);
    }

    useEffect(() => {
        const getName = async () => {
            const nameDoc = await getDoc(collection(db, `/Classes/${classID}/Students/${auth.currentUser.uid}`))
            if(nameDoc){
                setName(nameDoc.data().name)
            }
            else{
                setName("Teacher (You)")
            }

        }

        getName();

        Array.from({ length: questions.length + 1 }, (_, index) => (
            setAnswers([...answers, []])
        ))
    },[])


    const setMultipleChoiceAnswer = (event, choiceIndex) => {

        var answer = event.currentTarget.querySelector('p[type="answer"]').innerHTML



        if(index === 1){

            setAnswers([{answer, correctIndex: choiceIndex}, ...answers.slice(1)]);

        }
        else {
            setAnswers([...answers.slice(0, index - 1), {answer, correctIndex: choiceIndex}, ...answers.slice(index)]);
        }

    }

    const setFillInTheBlankAnswer = () => {
        const fillInTheBlankBox = document.querySelector('.fillInTheBlankBox');
        const inputs = fillInTheBlankBox.querySelectorAll('input');
        var answer = []
        
        for(var i = 0; i < inputs.length; i++){
            answer = [...answer, inputs[i].value]
        }

        console.log(answer)

        if(index === 1){
                
                setAnswers([{answer}, ...answers.slice(1)]);
    
            }

            else{
                setAnswers([...answers.slice(0, index - 1), {answer}, ...answers.slice(index)]);
            }

        console.log(answers)
    }

    const setLongAnswer = (event) => {
        const longAnswerBox = document.querySelector('.longAnswerBox');
        const input = longAnswerBox.querySelector('textarea');

        var answer = input.value

        if(index === 1){
                
            setAnswers([{answer}, ...answers.slice(1)]);

        }

        else{
            console.log(index)
            console.log(answers.slice(0, index - 1))
            setAnswers([...answers.slice(0, index - 1), {answer}, ...answers.slice(index)]);
        }

        console.log(answers)


    }

    const changeQuestions = (questionIndex) => {
        setIndex(questionIndex + 1)
    }

    const onFinish = () => {
        console.log(answers)
        addDoc(quizAnswersDataRef, {
            answers: answers.slice(0, questions.length),
            userID: auth.currentUser.uid,
            date: new Date(),
            email: auth.currentUser.email,
            name
        }).finally(() => {
            navigate(`/class/${classID}`)
        })
    }


  return (
    <div class = "relative min-h-[500px] ">
        <div style = {{display: confirm? "" : "none"}} class = "relative m-auto w-[300px] h-[100px]">
            <p class = "text-center">Are you finished?</p>
            <div class = "flex justify-between"><button class = "text-red-400" onClick = {() => {setConfirm(false)}}>go back</button> <button class = "text-green-400" onClick={() => {onFinish()}}>Confirm</button></div>

        </div>

        <div style = {{display: confirm? "none" : ""}}>

            <div class = "relative indexBox">
                <div style={{height: collapseQuestions? "300px": "40px"}} class = "fixed top-50 right-20 w-[250px] text-gray-400 text-sm border-2 border-black rounded-xl">
                    <div class = "cursor-pointer flex justify-between" onClick = {() => {setCollapseQuestions(!collapseQuestions)}}>
                        Questions 
                        <div class = "align-end mr-2">{collapseQuestions ? <FontAwesomeIcon icon = {faArrowDown}/> : <FontAwesomeIcon icon = {faArrowUp}/>}</div>
                    </div>

                    <div class = "grid grid-cols-4 gap-4 p-2">
                        
                    { questions.map((element, questionIndex) => {
                            return(
                                    <div style={{ borderColor: answers[questionIndex]?.answer ? "rgb(12, 180, 12)" : "black" , display: collapseQuestions? "": "none"}} key = {questionIndex} onClick={() => {changeQuestions(questionIndex)}} class = "grid grid-cols-2 grid-rows-3 gap-4 h-[30px] text-gray-400 text-sm border-2 border-black rounded-xl mt-4 cursor-pointer">
                                    <div class="flex align-middle ml-4">{questionIndex + 1}.</div>
                                    </div>
                            )

                        })}

                    </div>


                </div>
            </div>

            <p class = "text-gray-400 text-sm">Question {index}</p>
            
            
            {questions[index-1].type === "multipleChoice" && (
                <div>
                    <div class = " flex align-middle font-bold text-2xl mb-4 ">{questions[index-1].question}</div>
                    <div>

                        {questions[index-1].answers.map((element, choiceIndex) => {
                            
                            return(
                                <div key = {choiceIndex} class = "flex align-middle border-2 border-black-400 w-[200px] h-[50px] mt-3 items-center cursor-pointer px-2" onClick = {(event) => {toggleRadio(event, choiceIndex)}}>
                                    <input class = "mr-2" type="radio" id={element} checked ={answers && answers[index - 1] && (answers[index - 1].correctIndex === choiceIndex)} name="answer" value={element}/>
                                    <p type = "answer" class = "text-center flex align-center" for={element}>{element.value}</p>
                                    <p class = "ml-auto text-xl font-bold">{String.fromCharCode(choiceIndex + 65)}</p>
                                </div>
                            )
                        })}

                    </div>

                </div>
            )}

            {questions[index-1].type === "fillInTheBlank" && (
                <div class = "fillInTheBlankBox"> 
                    <div class = " flex align-middle font-bold text-2xl mb-4">{questions[index-1].question}</div>
                    <div class = "border-2 border-grey-400 w-[600px] min-h-[200px] mx-auto word-wrap-break">
                        {questions[index-1].question}
                    </div>

                    <div class = "flex flex-col w-[600px] mx-auto mt-4">
                        {console.log(index)}
                        {console.log(answers)}
                    
                        {Array.from({ length: questions[index - 1].answers.length }, (_, boxIndex) => (
                            <div class = " min-h-[30px] flex mt-4">{boxIndex}. <input value={answers[index - 1]?.answer?.[boxIndex] ?? ''} onChange={(event) => {setFillInTheBlankAnswer(event)}} class = "border-2 border-black"/></div>
                        ))}
                    </div>
                    
                </div>
                
                
            )}

            {questions[index-1].type === "longAnswer" && (
                <div class = "longAnswerBox">
                    {/*--------------------add title -----------------*/}

                    <div class = " mt-5 border-2 border-grey-400 w-[600px] min-h-[200px] ml-6 word-wrap-break">
                        {questions[index-1].question}
                    </div>

                    <div class = "w-[70%] m-auto">
                        <p class = "mt-4">Answer:</p>

                        <textarea class = "border-2 border-black-400 my-10" value = {answers[index - 1]?.answer ?? ''}  onChange = {(event) => {setLongAnswer(event)}}rows={10} cols = {80}></textarea>
                    </div>

                </div>
            )}

            
            {
                index != 1?  <button class = "absolute bottom-0 left-0 text-red-400" onClick={() => {onPreviousQuestion()}}><FontAwesomeIcon icon = {faArrowLeft}/> Previous Question</button>: <></>
            }  

            {index == questions.length ? 
            
                <button class = "absolute bottom-0 right-0 text-purple-400" onClick={() => {setConfirm(true)}}><FontAwesomeIcon icon = {faCheck}/>Finished</button>
            
            : 

                <button class = "absolute bottom-0 right-0 text-green-400" onClick={() => {onNextQuestion()}}>Next Question <FontAwesomeIcon icon = {faArrowRight}/></button>
            }
        </div>
        
    </div>
  )
}
