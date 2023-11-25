import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { useState } from 'react';
import { Loading } from '../Reusables/Loading';

export const CheckAnswersTeacher = () => {
    const navigate = useNavigate();
    const {quizID, classID} = useParams();
    const [quizAnswersDoc, setQuizAnswersDoc] = useState(null);
    
    useEffect(() => {
        const getQuizAnswers = async () => {
            const quizAnswersDoc = await getDocs(collection(db, `Classes/${classID}/Quizzes/${quizID}/Answers`))
            setQuizAnswersDoc(quizAnswersDoc)
        }

        getQuizAnswers();
    }, [])

    useEffect(() => {
        if(quizAnswersDoc) console.log(quizAnswersDoc.docs[0].data())
    }, [quizAnswersDoc])

    const onAnswerClick = (Id) => {
        navigate(`/class/${classID}/quiz/${quizID}/answers/${Id}`)
    }


  return (

    <div>
        {!quizAnswersDoc? <Loading/> :

            <div class = "flex-col border-2 border-black w-[1000px] m-auto h-[400px] px-10 mt-20">

                <div class = 'grid grid-cols-3 justify-between border-b-2 border-black mt-2'>
                    <div>Student Email</div>
                    <div class = "w-[83px]">Mark</div>
                    <div class = "text-center">Answers</div>
                </div>

                {quizAnswersDoc.docs.map((doc) => {
                    {console.log(doc.id)}
                    

                    return(
                        <div class = 'grid grid-cols-3 justify-between mt-3'>
                            <div>{doc.data().email}</div>
                            <div>{doc.data().mark? doc.data().mark: "Not Graded"}</div>
                            <button class = "font-bold" onClick = {() => {onAnswerClick(doc.id)}}>Answers</button>
                        </div>
                    )
                    

                })}

            </div>
        
        
        }
    </div>
  )
}
