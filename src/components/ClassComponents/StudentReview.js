import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Loading } from '../Reusables/Loading';
import { useEffect } from 'react';
import { getDocs, collection, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const StudentReview = () => {
  const navigate = useNavigate();
  const {studentID, classID, quizID} = useParams();
  const [studentAnswer, setStudentAnswer] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const getAnswers = async () => {
      const studentAnswers = await getDocs(collection(db, `Classes/${classID}/Quizzes/${quizID}/Answers/`), studentID, where("userID", "==", studentID))
      setStudentAnswer(studentAnswers.docs[0].data().answers)
      setFeedback(studentAnswers.docs[0].data().feedback)
      console.log(studentAnswers.docs[0].data().answers)
    }
    const getQuestions = async () => {
      const quizRef = doc(db, `Classes/${classID}/Quizzes/`, quizID)
      const quizQuestions = await getDoc(quizRef)
      console.log(quizQuestions.data())
      setQuestions(quizQuestions.data().questions)
    }
    getAnswers();
    getQuestions();

  }, [])

  const onFinish = () => {
    navigate(`/Class/${classID}/Quiz/${quizID}`)
  }
  return (
    <div>
      {!studentAnswer || !feedback || !questions? <Loading/> :
        <div class = "flex-col border-2 border-black w-[1000px] m-auto min-h-[400px] h-auto px-10 mt-20 pb-4 mb-10">
          <div class = "text-center font-bold text-2xl">Review</div>

          {studentAnswer.map((answer, index) => (

            
            
            <div class = 'flex flex-col mt-4 break-words'>


              {console.log(feedback[index])}
              
              <div class = "font-bold">{"Question: " + (index + 1)}</div>
              <div class = "border-2 border-gray-300">{questions[index].question}</div>
              <div class = "font-bold">{"Answer: "}</div>
              {questions[index].type == 'multipleChoice' ? 
                <>{questions[index].answers.map((questionAnswers, index) => {
                  return(
                    <div class = "flex">
                      <div style = {{backgroundColor: (answer.correctIndex == index)? "lightgreen" : "tomato"}}  class = "flex align-middle border-2 border-black-400 w-[200px] h-[50px] mt-3 items-center px-2">
                        <input class = "mr-2" checked = {answer.answer == questionAnswers.value} type = "checkbox"/>
                        <p>{questionAnswers.value}</p>
                      </div>
                    </div>
                  )
                })}</> 
              : 
              <>{questions[index].type === "fillInTheBlank" ? 
                <>
                  {questions[index].answers.map((questionAnswers, innerIndex) => {
                    return(
                      <div class = "flex align-middle">
                        <p class = " h-5 my-auto mr-2">{index + 1}: </p>
                        <div class = "border-2 border-black-400 w-[200px] h-[50px] mt-3 items-center px-2 flex py-0 mb-2">
                          <p class = "my-auto">{answer.answer[index]}</p>
                        </div>

                        <div class = "flex ml-4">
                          <p class = "m-auto"> correct answer: {questions[index].answers[innerIndex].value}</p>
                        </div>
                      </div>
                    )
                  })}
                </>
              : 
                <>{/*LongAnswer*/}
                  <div class = "border-2 border-black mt-2 break-words w-[400px] h-[150px]">{answer.answer}</div>
                </>}
              </>}
              

              <div class = "flex">

                <div class = "flex"><p class = "font-bold mr-4">Mark: </p> {feedback[index].numerator}/{feedback[index].denominator} </div>

              </div>

              <div class = "font-bold">Reason: </div>

              <div>
                <textarea value = {feedback[index].reason} cols={50} rows={5} class = "border-2 border-black mt-2 w-auto" placeholder='Reason'/>
              </div>

            </div>
          )

        )}
        <div class = "flex">
          <button onClick = {() => {onFinish()}} class = "mb-2 mx-auto border-2 border-green-500 rounded-md bg-green-300 px-2 py-1">Finish</button>
        </div>
        </div>
      }
    </div>
  )
}
