import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {db} from '../firebase'
import { collection } from 'firebase/firestore'
import { Loading } from '../Reusables/Loading'
import { useState } from 'react'
import { getDocs } from 'firebase/firestore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const StudentList = () => {
    const [loading, setLoading] = useState(true);
    const [studentList, setStudentList] = useState([]);
    const {classID} = useParams();
    const studentListRef = collection(db, `/Classes/${classID}/Students`)
    const navigate = useNavigate();
    
    const fetchStudentList = async () => {
        try {
            const querySnapshot = await getDocs(studentListRef);
            const studentList = querySnapshot.docs.map((doc) => doc.data());
            setStudentList(studentList);
        } catch (error) {
            console.error('Error fetching student list:', error);
        }
    };

    
    useEffect(() => {
        fetchStudentList();
    }, [])

    useEffect(() => {
        if(studentList){
            console.log(studentList)
            setLoading(false);
        }
    }, [studentList])

  return (
    <div>
        {loading? 
            <Loading/>

            :
            
            <div>

            <div class = "flex-col border-2 border-black w-[1000px] m-auto h-[400px] px-10 mt-20">
                <button class = "absolute top-14 right-10 border-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-auto m-2 h-[40px] w-[160px] align-middle text-sm flex justify-center items-center" onClick={() => {navigate("/class/Ve130Cm9LixusNn30kEC/studentList/addStudent")}}>
                    <FontAwesomeIcon icon = {faPlus}/>
                    Add Student
                </button>
                <p class = "text-center w-[100%]">Students</p>

                <div class = "flex justify-between mt-5 border-b-2 border-black">
                    <div>Name</div>
                    <div>studentID</div>
                </div>


                <div class = "flex flex-col">
                    {studentList.map((student, index) => (
                        console.log(student),
                        <div key={index} className="flex justify-between h-5 w-[100%]">
                            <p>{student.name}</p>
                            <p>{student.studentID}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>}
    </div>
  )
}
