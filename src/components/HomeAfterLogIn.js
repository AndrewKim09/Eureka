import React, {useContext} from 'react'
import { userContext } from '../App'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { set } from 'react-hook-form';






export const HomeAfterLogIn = () => {

  const {getQuery} = React.useContext(userContext); 
  const [userQuerySnapshot, setUserQuerySnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [username] = useAuthState(auth);
  const [classes , setClasses] = useState(null);
  const [classesLoaded, setClassesLoaded] = useState(false);
  const [classesData, setClassesData] = useState(null);
  const [typeOfUser, setTypeOfUser] = useState("Student");
  

  const navigate = useNavigate();


  const onCreateClick = () => {
    navigate("/create");
  }
  
  const getData = async () => {
    try{
      setUserQuerySnapshot(await getQuery());
    }
    catch(error){
      console.log("getData Error: " + error)
    }
  }


  useEffect(() => {
    try{
      const fetchData = async () => {
        const teacherQuerySnapshot = await getDocs(query(collection(db, "Teachers"), where("email", "==", username.email)));
        if(teacherQuerySnapshot.size == 1){
          setClasses(await getDocs(query(collection(db, "Classes"), where("email", "==", username.email))))
          setTypeOfUser("Teacher");
        }
        else{
          const classesSnapshot = await getDocs(collection(db, "Classes"));

          classesSnapshot.forEach(async (doc) => {
            const studentsCollectionRef = collection(doc.ref, "Students");
            const studentDocs = await getDocs(query(studentsCollectionRef, where("email", "==", username.email)));
            console.log(studentDocs)

            if(studentDocs.size == 1){
              console.log(doc.data().className);
              setClasses(await getDocs(query(collection(db, "Classes"), where("className", "==", doc.data().className))));
            }

          });
        }
        await getData(); // Wait for getQuery to finish
        setClassesLoaded(true);

      };

      

        fetchData();
        
    }
    catch(error){
      console.log("useEffect Error: " + error)
    }
    
  }, [username]);

  useEffect(() => {
    try{
      if(userQuerySnapshot){
        setUserData(userQuerySnapshot.docs[0].data())
        setLoading(false);
      }
    }
    catch(error){
      console.log("useEffect Error: " + error)
    }
  }, [userQuerySnapshot]);

  useEffect(() => {
    console.log(classes)
      if(classes != null){
        const newData = classes.docs.map(element => ({
          id: element.id,
          className: element.data().className,
          season: element.data().season,
          image: element.data().classImage,
         
        }));

        setClassesData(newData);

      }

    
  }, [classes]);

  const onClassClick = (classId) => {
    navigate("/class/" + classId);
    console.log(classId)
  }

    
  return (
    <>
    {loading ? <div>Loading...</div> :
    <div id = "HomePage">

          <div>
            <div class = "flex justify-end px-5">
              {typeOfUser == "Teacher" ? <button class = "border-none font-bold" onClick={onCreateClick}> <FontAwesomeIcon size = "1x" color = "green" icon={faPlus} />  Create New Class</button> : <div>&nbsp;</div>}
            </div>
            <div class = "text-xl font-bold px-5">Classes</div>
            <div class = "flex justify-center">             
              <div id = "classes" class = " grid grid-cols-3 gap-4 mt-5 min-h-[800px] h-[100%] w-[80%] justify-self-center grid-rows-3">
                {classesData && classesData.map((element) => (
                    <div id="classBox" className="relative border-2 border-black rounded-md" onClick = {() => {onClassClick(element.id)}}>
                      <img class = "w-[100%] h-[40%] object-cover" src = {"" + element.image} />
                      <p class = "font-bold text-[1em]">{element.className}</p>
                      <div class = "absolute right-0 top-0 bg-gray-500 py-1 px-2 rounded-md">{element.season}</div>
                    </div>
                  ))}
              </div>
          </div>
          </div>
    </div>
}
    </>

  );

}
