import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc } from 'firebase/firestore';
import { db } from '../firebase';
import { getDoc } from 'firebase/firestore';
import { useState } from 'react';
import {QuizStart} from './QuizStart'
import { Loading } from '../Reusables/Loading';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faClipboard } from '@fortawesome/free-solid-svg-icons';

export const QuizDetails = () => {
  const [username] = useAuthState(auth)
  const [userType, setUserType] = useState("");
  const {quizID} = useParams();
  const {classID} = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [quizDoc, setQuizDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStart, setQuizStart] = useState(false);
  const [mark, setMark] = useState(null);
  const [studentAnswerID, setStudentAnswerID] = useState(null);
  const navigate = useNavigate();


  const checkTypeOfUser = async () => {
    if(!username) return;
    const teacherQuerySnapshot = await getDocs(query(collection(db, "Teachers"), where("email", "==", username.email)));
    if(teacherQuerySnapshot.size == 1){
      setUserType("Teacher")
      console.log("Teacher")
    }else{
      setUserType("Student")
      
    }
  }

  const quizRef = doc(db, `Classes/${classID}/Quizzes/${quizID}`)
  useEffect(() => {
    checkTypeOfUser();
    submittedCheck();
    getDoc(quizRef)
  .then((docSnapshot) => {
    if (docSnapshot.exists()) {
      setQuizDoc(docSnapshot.data())
    } else {
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.error("Error getting document:", error);
  });
  }, [username])
  

  useEffect(() => {
    if(quizDoc){
      setLoading(false)
    }

  }, [quizDoc])

  const onCheckAnswersClick = () => {
    navigate(`/class/${classID}/quiz/${quizID}/answers`)
  }




  const submittedCheck = async () => {
    try{
      if(!username || userType == "Teacher") return;
      const submittedAnswerRef = query(collection(db, `Classes/${classID}/Quizzes/${quizID}/Answers`), where("email", "==", auth.currentUser.email));
      const submittedAnswerSnapshot = await getDocs(submittedAnswerRef);
      if(submittedAnswerSnapshot.size >= 1){
        setStudentAnswerID(submittedAnswerSnapshot.docs[0].id)
        console.log(submittedAnswerSnapshot)
        setMark(submittedAnswerSnapshot.docs[0].data().mark)
        console.log(submittedAnswerSnapshot.docs[0].data().mark)
        setSubmitted(true);
      }
      else{
        console.log(submittedAnswerSnapshot)
      }
    }
    catch(error){
      console.log("submittedCheck Error: " + error)
    }

  }

  const onStartQuiz = () => {
    if((new Date()) > quizDoc.date.toDate()){
      alert("Quiz is past deadline")
      return;
    }
    else{
      setQuizStart(true);
    }
  }

  return (
    <div>{loading?
      <Loading/>

      :
      
      <div class = "mt-[100px] relative flex flex-col border-2 border-solid border-gray-200  w-[1000px] m-auto min-h-[500px] h-auto mb-[60px]">
        {(!quizStart)? 
          <div class = "flex flex-col">

            <div class="flex flex-row mx-auto font-bold text-2xl">{quizDoc.title}</div>
            <div class="flex flex-row mx-auto text-sm text-gray-600 border-b-2 mb-4 w-[800px] justify-center">Due: {quizDoc.date.toDate().toString()}</div>
            <div class="flex flex-row mx-auto textlg w-[800px] text-center">{quizDoc.description}</div>


            <div class = "absolute left-1/2 bottom-0 transform -translate-x-1/2">
              {userType != "Teacher"?<div class = "text-center mr-2 mb-5 cursor-pointer" onClick={() => {navigate(`answer/${studentAnswerID}`)}}>Grade: {mark? ""+ mark +"%"  : "no grade"}<FontAwesomeIcon icon = {faClipboard}/></div> : null}
              <div class = "flex flex-col text-center mb-3 text-xs">{quizDoc.questions.length} questions</div>
              {!submittedCheck? 
                <div class = "flex mx-auto w-[30%] justify-between">
                  {userType === "Teacher"? <button class = "mb-2 border-2 border-green-500 rounded-md bg-green-300 px-2 py-1" onClick={() => {onCheckAnswersClick()}}>Check Student Answers</button> :
                    <button class = "relative left-1/2 bottom-0 transform -translate-x-1/2 border-solid border-2 border-grey-300 w-[150px] bg-red-400" onClick = {() => {onStartQuiz()}}>Start Quiz</button>
                  }
                </div>
                  :
                <div class = "flex mx-auto w-[100%] justify-between m-0">
                  {userType === "Teacher"? <button class = "mb-2 border-2 border-green-500 rounded-md bg-green-300 px-2 py-1" onClick={() => {onCheckAnswersClick()}}>Check Student Answers</button> : <div>Quiz Submitted</div>}
                </div>
            }
              
            </div>
            
          </div>
        
          :

          <QuizStart questions = {Array.from(quizDoc.questions)}/>
        
        }

    </div>
    
    
    
    }</div>
  )
}
