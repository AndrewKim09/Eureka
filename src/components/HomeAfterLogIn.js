import React, {useContext} from 'react'
import { userContext } from '../App'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';




export const HomeAfterLogIn = () => {
  const {getQuery} = React.useContext(userContext); 
  const [userQuerySnapshot, setUserQuerySnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [username] = useAuthState(auth);
  const [classes , setClasses] = useState(null);
  const [classesLoaded, setClassesLoaded] = useState(false);
  

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
        setClasses(await getDocs(query(collection(db, "Classes"), where("email", "==", username.email))))
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

      if(userQuerySnapshot.docs[0]){
        setUserData(userQuerySnapshot.docs[0].data())
        setLoading(false);
      }
    }
    catch(error){
      console.log("useEffect Error: " + error)
    }
  }, [userQuerySnapshot]);

  useEffect(() => {
      if(document.getElementById("classes") != null){
        var classesElement=document.getElementById("classes").innerHTML;
        console.log(classes)
        console.log(classes.docs);
        console.log(classesElement)

        classesElement.innerHTML = ``;
        classes.docs.map((doc) => (
          classesElement.innerHTML +=`<div>${doc.data().className}</div>`
        ));
      }
    
  }, [classes]);

    
  return (
    <>
    {loading ? <div>Loading...</div> :
    <div id = "HomePage">
          {userData && userData.typeOfUser == "Student" ?
          
          <div>Student</div> : 

          <div>
            <div class = "flex justify-end px-5">
              <button class = "border-none font-bold" onClick={onCreateClick}> <FontAwesomeIcon size = "1x" color = "green" icon={faPlus} />  Create New Class</button>
            </div>
            <div id = "classes" class = "grid w-[100%] grid-cols-3 gap-4 mt-5">
            </div>
          </div>
          }
    </div>
}
    </>

  );

}
