import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userContext } from '../../App';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward,} from '@fortawesome/free-solid-svg-icons';
import { getDocs, query, where } from 'firebase/firestore';


// Firebase imports
import { db, auth } from '../firebase';
import { addDoc, collection, } from 'firebase/firestore';
import { ref, uploadBytes, getStorage, getDownloadURL, deleteObject } from 'firebase/storage';

// Custom import
import { GetPosts } from '../getData/GetPosts';
import {CreatePost} from './CreatePost';
import { ClassHomePage } from './ClassHomePage';
import { CreateQuiz } from './CreateQuiz';


export const Class = () => {
    const [userType, setUserType] = useState("Student")
    const {classID} = useParams();
    const {getQuery} = React.useContext(userContext);
    const [userQuerySnapshot, setUserQuerySnapshot] = useState(null);
    const [username] = useAuthState(auth)
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [createState, setCreateState] = useState(false);
    const[classesLoaded, setClassesLoaded] = useState(false)
    //----INPUT------//
    const [type, setType] = useState("default");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    //const [storageRef, setStorageRef] = useState(null);
    //----ERRORS-------//
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [typeError, setTypeError] = useState("");
    //----DATA------//
    const {announcementsDocs, postsDocs, lecturesDocs, quizzesDocs} = GetPosts({classID}); 
    //----------------------------------VARIABLES----------------------------------//

    //----FUNCTIONS-----//

    const storage = getStorage();

    

    const onCreateClick = () => {
      if(createState){
          window.location.reload();
      }
        setCreateState(!createState);
    }

    const onTypeChange = (event) => {
      setType(event.target.value)
      console.log(type)
    }

    const getData = async () => {
        try{
          setUserQuerySnapshot(await getQuery());
        }
        catch(error){
          console.log("getData Error: " + error)
        }
      }

      /*---------------------onSubmit---------------------*/
      const onSubmit = async (event) => {
        console.log(title)
        console.log(description)
        console.log(file)
        console.log(type)
  
        setTitleError("");
        setDescriptionError("");
        setTypeError("");
  
        if(title === ""){
          setTitleError("Please enter a title")
          return;
        }
  
        if(description === ""){
          setDescriptionError("Please enter a description")
          return;
        }
  
        if(type === "default"){
          setTypeError("Please select a type")
          return;
        }
  
        if(type === "Quiz"){
          onSubmitQuiz(event)
        }
        else{
          onSubmitOther(event)
        }
  
    }

    const onSubmitQuiz = (event) => {
        console.log("Quiz")
        event.preventDefault();
      }
  
      const onSubmitOther = (event) => {
        event.preventDefault();
  
        if(file){
          try{
            uploadBytes(ref(storage, 'posts/files/' + file[0].name), file[0])
              .then(async (storageRef) => {
                const fileURL = await getDownloadURL(storageRef.ref)
                addDoc(collection(db, `Classes/${classID}/${type}`), {
                  title,
                  description,
                  fileName: file[0].name,
                  file: fileURL,
                  type,
                  date: new Date(),
                }).finally(() => {
                  console.log("Uploaded")
                  window.location.reload();
                  })
                
              })
          }
          catch (error){
            console.log("uploadBytes:" + error)
          }
        }
        else{
          addDoc(collection(db, `Classes/${classID}/${type}`), {
            title,
            description,
            type,
            date: new Date(),
          }).finally(() => {
          console.log("Uploaded")
          window.location.reload();
          })
        }
  
       
        
      }


    
    //----------------------------------USE EFFECTS ----------------------------------//
    
      useEffect(() => {
        try{
          const fetchData = async () => {
            await getData(); // Wait for getQuery to finish
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
        try{
          if(userData){
            console.log(userData)
          }
        }
        catch(error){
          console.log("useEffect Error: " + error)
        }
      }, [userData]);

      useEffect(() => {
      }, [createState]);
      

      useEffect(() => { 
        if (announcementsDocs !== null) { // Check if announcementsDocs is not null
          console.log(announcementsDocs)
          setClassesLoaded(true);
        }
      }, [announcementsDocs]);

      useEffect(() => { 
        const checkTypeOfUser = async () => {
          const teacherQuerySnapshot = await getDocs(query(collection(db, "Teachers"), where("email", "==", username.email)));
          if(teacherQuerySnapshot.size == 1){
            setUserType("Teacher")
            
          }else{
            setUserType("Student")
            
          }
        }
    
        checkTypeOfUser();
      }, [])
      

      

      return (
        <div class="w-full h-full">
          {loading ? (
            <div>Loading</div>
          ) : (
            /*---------------------INSTRUCTOR---------------------*/
            createState == false ? (
              <ClassHomePage userType={userType} classesLoaded={classesLoaded} setCreateState={setCreateState} createState={createState} db={db} storage={storage} announcementsDocs={announcementsDocs} postsDocs={postsDocs} lecturesDocs={lecturesDocs} quizzesDocs={quizzesDocs}/>
            ) : (
              /*---------------------CREATE---------------------*/
              <div class="flex-row">
                <div class="w-full h-full">
                  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full ml-auto m-2 h-[25px] w-[70px] text-sm" onClick={() => onCreateClick()}><FontAwesomeIcon icon = {faBackward}/> back </button>
                  <div class="border-2 border-solid border-gray-200  w-[1000px] m-auto min-h-[500px] h-auto pb-[60px] mb-[60px]">
                    <label for = "type" class = "p-0 m-2">
                      <p>Type of post</p>
                    <select id = "type" class = "border-solid border-black border-2" onChange={(event) => {onTypeChange(event)}}>
                      <option value= "default">Select a type</option>
                      <option value="Announcement">Announcement</option>
                      <option value="Post">Post</option>
                      <option value="Lecture">Lecture</option>
                      <option value="Quiz">Quiz</option>
                    </select>
                    </label>
                    <div>

                      {type === "default" ? <></>

                      :

                      type === "Quiz" ? 
                      /*---------------------Quiz---------------------*/

                      <CreateQuiz titleError = {titleError} setTitle = {setTitle} descriptionError = {descriptionError} setDescription={setDescription} title = {title} description={description}/>
                      :
                      /*---------------------Announcement, Post, Lecture---------------------*/
                      <CreatePost onSubmit = {onSubmit} titleError={titleError} setTitle={setTitle} setDescription={setDescription} setFile={setFile} descriptionError={descriptionError} setTypeError={setTypeError}/>
                       
                      
                    }



                    </div>
                  </div>
                
                </div>
              </div>
            )
          )}
        </div>
      );
}
