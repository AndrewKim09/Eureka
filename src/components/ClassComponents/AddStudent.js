import React from 'react'
import { db } from '../firebase'
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

export const AddStudent = () => {
    const {classID} = useParams();
    const [IDError, setIDError] = useState("");


    const classStudentsRef = collection(db , `/Classes/${classID}/Students`)

    const addStudent = async (event) => {
        setIDError("")
        const studentID = document.querySelector(".StudentID").value;
        const querySnapshot = await getDocs(query(collection(db, "Students"), where("studentNumber", "==", studentID)));
        const duplicateCheck = await getDocs(query(collection(db, `/Classes/${classID}/Students`), where("studentNumber", "==", studentID)));

        console.log(querySnapshot.docs[0].id)

        if(duplicateCheck.size == 1){
            setIDError("Student already in class")
            return;
        }
        if(querySnapshot.size == 1){
            addDoc(classStudentsRef, {
                name: querySnapshot.docs[0].data().name,
                studentID: querySnapshot.docs[0].data().studentNumber,
                email: querySnapshot.docs[0].data().email,
                classID: classID,
            })

            const studentRef = collection(db, `Students/${querySnapshot.docs[0].id}/Classes`)

            addDoc(studentRef, {
                classID: classID
            })

            setIDError("Student Added")
        }
        else{
            setIDError("Student ID not found")
        }

        

    }

  return (
    <div class = "m-auto border-2 border-gray-400 w-[500px] mt-10">
        <p class = "error">{IDError}</p>
        <label for = "studentID">
            Student id
            <input class = "StudentID ml-4" placeholder='Enter StudentID' />
        </label>

        <div class = "flex justify-center mb-5">
            <button onClick ={(event) => {addStudent(event)}}  class = "justify-center rounded-lg border-2 border-green-400 bg-green-300 px-2 py-1">Add Student</button>
        </div>
    </div>
  )
}
