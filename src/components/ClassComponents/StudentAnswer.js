import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDocs, collection, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import { where } from 'firebase/firestore';
import { Loading } from '../Reusables/Loading';
import { doc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';

export const StudentAnswer = () => {
    const {classID, quizID, studentID} = useParams();
    const [studentAnswer, setStudentAnswer] = useState(null);
    const [givenMark, setGivenMark] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [errorCheck, setErrorCheck] = useState(false);
    const [studentAnswerRef, setStudentAnswerRef] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate();
    

    useEffect(() => {
      
        const getAnswers = async () => {
            const studentAnswers = await getDocs(collection(db, `Classes/${classID}/Quizzes/${quizID}/Answers/`), studentID, where("userID", "==", studentID))

            if(studentAnswers.docs[0].data().feedback){
              setFeedback(studentAnswers.docs[0].data().feedback)
            }

            setStudentAnswerRef(studentAnswers.docs[0].ref)
            setStudentAnswer(studentAnswers.docs[0].data().answers)
            console.log(studentAnswers.docs[0].data().answers)
        }


        const getQuestions = async () => {
          const quizRef = doc(db, `Classes/${classID}/Quizzes/`, quizID)
          const quizQuestions = await getDoc(quizRef)
          console.log(quizQuestions.data())
          setQuestions(quizQuestions.data().questions)

            
        }

        getQuestions();
        getAnswers();
    }, [])

    useEffect(() => {
      if(questions) setGivenMark(new Array(questions.length).fill({numerator: null, denominator: null, reason: null}))
      if(feedback && questions){
        setGivenMark(feedback.map((mark, index) => {
          return{
            numerator: feedback[index].numerator,
            denominator: feedback[index].denominator,
            reason: feedback[index].reason
          }
        }))
      }
      
    },[questions, feedback])

    useEffect(() => {
      console.log("-----")
      console.log(givenMark)
    }, [givenMark])

    const onMarkChange = (event, index, type) => {
      document.getElementsByClassName("error")[index].innerHTML = ""



      
      setGivenMark(() => {
        setErrorCheck(false)
        return givenMark.map((item, i) => {
          console.log(item)

          
          if (i === index) {
            if(type == "numerator"){
              const updatedNumerator = parseInt(event.target.value);
              const currentDenominator = parseInt(item.denominator);


              if(updatedNumerator > currentDenominator){
                setErrorCheck(true)
                console.log("error")
                document.getElementsByClassName("error")[index].innerHTML = "Invalid mark"
              } 
              return { ...item, numerator: updatedNumerator };

            }
            else {
              const updatedDenominator = parseInt(event.target.value);
              const currentNumerator = parseInt(item.numerator);

              if(currentNumerator > updatedDenominator){
                setErrorCheck(true)
                console.log("error")                
                document.getElementsByClassName("error")[index].innerHTML = "Invalid mark"
              }
              return { ...item, denominator: updatedDenominator }
            
            };
          }

          return item;
        });
      });
    };
    
    const onReasonChange = (event, index) => {
      setGivenMark(() => {
        return givenMark.map((item, i) => {
          if (i === index) {
            return { ...item, reason: event.target.value };
          }
          return item;
        });
      });


    };

    const onFinish = () => {
      console.log(givenMark)
      if(errorCheck){
        alert("Invalid mark")
        return;
      }

      var error = false;

      givenMark.forEach((mark, index) => {
        if(isNaN(mark.numerator) || isNaN(mark.denominator)){
          alert("Please enter a mark for question " + (index + 1))
          error = true;
          return;
        }
        else if(parseInt(mark.numerator) > parseInt(mark.denominator)){
          alert("Invalid mark for question " + (index + 1))
          error = true;
          return;
        }
        else if(!mark.reason){
          alert("Please enter a reason for question " + (index + 1))
          error = true;
          return;
        }
      })

        if(!error) {
          const studentGradesRef = collection(db, `Students/${studentID}/Grades/`)

          var numerator = 0;
          var denominator = 0

          givenMark.forEach((mark) => {
            numerator += mark.numerator
            denominator += mark.denominator
          })

          updateDoc(studentAnswerRef, {
            mark: (numerator / denominator) * 100,
            feedback: givenMark
          })

          addDoc(studentGradesRef, {
            classID,
            quizID,
            mark: givenMark,
            total: (numerator / denominator) * 100
          }).finally(() => {
            navigate(`/class/${classID}/quiz/${quizID}/answers`)
          })
        }
    }

  return (
    <div>
      {!studentAnswer || !questions ? <Loading/> :
      

        <div class = "flex flex-col border-2 border-black w-[1000px] m-auto min-h-[400px] px-10 mt-20 h-auto pb-4 mb-4">
          {studentAnswer.map((answer, index) => (
            
              <div class = 'flex flex-col mt-4 break-words'>
                
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

                <p class = "font-bold">Mark</p>
                

                <div class = "flex">

                  <input value={givenMark? givenMark[index].numerator : ""} type = "number" min="0" onChange={(event) => {onMarkChange(event, index, "numerator")}} class = "w-[40px] mr-2 border-2 border-black" />
                  <p>/</p>
                  <input value = {givenMark? givenMark[index].denominator : ""} min="1" type = "number" class = "w-[40px] ml-2 border-2 border-black mr-2" onChange={(event) => {onMarkChange(event, index, "denominator")}}/>

                  <p class = "w-[100px] error mr-2"></p>
                  
                  {index == 0 && <p>e.g: 1/3</p>}

                </div>

                <div class = "font-bold">Reason: </div>

                <div>
                  <textarea value = {givenMark? givenMark[index].reason : ""} onChange = {(event) => {onReasonChange(event, index)}}cols={50} rows={5} class = "border-2 border-black mt-2 w-auto" placeholder='Reason'/>
                </div>

              </div>
            )

          )}
            <button onClick = {() => {onFinish()}} class = "mb-2 mx-auto border-2 border-green-500 rounded-md bg-green-300 px-2 py-1">Finish</button>
        </div>

      
      
      }
    </div>
  )
}
