import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { userContext } from '../App';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faTrash } from '@fortawesome/free-solid-svg-icons';


// Firebase imports
import { db, auth } from './firebase';
import { Timestamp, addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getStorage, getDownloadURL, deleteObject } from 'firebase/storage';
import { deleteDoc } from 'firebase/firestore';

// Custom import
import { GetPosts } from './getData/GetPosts';
import { number } from 'yup';


export const Class = () => {
    const [update ,setUpdate] = useState(false);
    const {classID} = useParams();
    const {getQuery} = React.useContext(userContext);
    const [userQuerySnapshot, setUserQuerySnapshot] = useState(null);
    const [username] = useAuthState(auth)
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [createState, setCreateState] = useState(false);
    const[classesLoaded, setClassesLoaded] = useState(false)
    const [deleteToggle, setDeleteToggle] = useState(false)
    //----INPUT------//
    const [type, setType] = useState("default");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [fileTitle, setFileTitle] = useState("")

    const [typeOfQuestion, setTypeOfQuestion] = useState("default")
    const [questions, setQuestions] = useState([])
    const [answer, setAnswer] = useState("")
    //const [storageRef, setStorageRef] = useState(null);
    //----ERRORS-------//
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [typeError, setTypeError] = useState("");

    //----DATA------//
    const {announcementsDocs, postsDocs, lecturesDocs} = GetPosts({classID}); 
    //----------------------------------VARIABLES----------------------------------//
    const [quizNumber, quizNumberSet] = useState(1);
    const [numberOfChoices, setNumberOfChoices] = useState(0);

    //----FUNCTIONS-----//

    const storage = getStorage();

    const addChoiceBox = () => {
      setNumberChoices(numberOfChoices + 1)

    }

    const onDeleteButtonClick = (event) => {
      event.currentTarget.classList.toggle("deleteToggle")
      setDeleteToggle(!deleteToggle)
    }
    
    const onDeleteClick = (element, type) => {
      const docRef = doc(db, `posts/${classID}/${type}/${element.id}`)
      const imageRef = ref(storage, `posts/files/${element.fileName}`)
      console.log(imageRef)
      deleteObject(imageRef)
      console.log(docRef)
      deleteDoc(docRef)
      

    }
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

      const onPostClick = (event, element) => {
        setUpdate(!update)
        element.expanded = !element.expanded
        event.currentTarget.parentElement.classList.toggle("expanded")
        
      }

      //----------------------------------ON SUBMIT ----------------------------------//

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
              addDoc(collection(db, `/posts/${classID}/${type}`), {
                title,
                description,
                fileName: file[0].name,
                file: fileURL,
                type,
                date: new Date(),
              })
              console.log("Uploaded")
              
            })
        }
        catch (error){
          console.log("uploadBytes:" + error)
        }
      }
      else{
        addDoc(collection(db, `/posts/${classID}/${type}`), {
          title,
          description,
          type,
          date: new Date(),
        })
        console.log("Uploaded")
        navigate(`/class/${classID}`)
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
      

      

      return (
        <div class="w-full h-full">
          {loading ? (
            <div>Loading</div>
          ) : userData.typeOfUser === "student" ? (
            <div>Student</div>
          ) : (
            /*---------------------INSTRUCTOR---------------------*/
            createState == false ? (
              <div class="flex flex-col h-[1000px]">
                
                <div class = "flex justify-end">

                  <button onClick={() => onCreateClick()} class ="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-auto m-2 h-[40px] w-[150px] text-sm">
                        Add Assignment
                  </button>

                  <button class = "font-bold py-2 px-4 rounded-full m-2 h-[40px] w-[150px] text-sm border-2 border-red-400 deleteButton" onClick = {(event) => {onDeleteButtonClick(event)}}> 
                  <FontAwesomeIcon icon = {faTrash}/>Delete
                  </button>
                </div>

                <div class = "flex flex-row w-[100%]">
                  
                  <div class = "flex flex-row w-[100%] mb-10">

                    <div class=" flex flex-col border-2 border-solid border-gray-200 w-[60%] ml-auto h-auto">
                      <p>Lectures</p>
                      {classesLoaded && lecturesDocs.map((element) => ( 
                        <div class="relative border-2 border-black rounded-md min-h-[150px] mb-3">

                          <p class = "titleBox font-bold text-2xl" onClick={(event) => {onPostClick(event, element)}}>
                            {element.description} 
                          </p>

                          <div class = "absolute right-0 top-0 bg-green-600 py-1 px-2 rounded-md text-sm">
                            {element.date.toLocaleString()}
                          </div>
                          {deleteToggle && <div class = ""><button class = "text-red-600 block" onClick = {() => {onDeleteClick(element, "Lecture")}}><FontAwesomeIcon icon = {faTrash}/></button></div>}
                          <div id = "typeBox" class = "bg-red-300">Lecture</div>
                          {element.expanded && (<div class = "my-4 break-words">{element.description}</div>)}
                          {element.expanded && (<a href = {element.file} target="_blank" class = "break-words underline decoration-1 underline-offset-0 text-blue-500">{element.fileName}</a>)}
                        </div>
                      ))}
                  
                    </div>

                    <div class = "flex flex-col w-[30%] mx-20">

                      <div class="flex flex-col border-2 border-solid border-gray-200 min-h-[40%] h-auto w-[100%] ">
                        <p>Announcements</p>
                        {classesLoaded && announcementsDocs.map((element) => ( 
                          <div  class="relative border-2 border-black rounded-md min-h-[100px] mb-3 h-auto">

                           <p class = "titleBox font-bold text-2xl" onClick={(event) => {onPostClick(event, element)}}>
                            {element.description} 
                          </p>
                          
                          <div class = "inline-block">
                            {deleteToggle &&<button class = "text-red-600" onClick = {() => {onDeleteClick(element, "Lecture")}}><FontAwesomeIcon icon = {faTrash}/></button>}
                          </div>

                          <div class = "absolute right-0 top-0 bg-green-600 py-1 px-2 rounded-md text-sm">
                            {element.date.toLocaleString()}
                          </div>


                          <div id = "typeBox" class = "bg-pink-200">Announcement</div>
                          {element.expanded && (<div class = "my-4 break-words">{element.description}</div>)}
                          {element.expanded && (<a href = {element.file} target="_blank" class = "break-words underline decoration-1 underline-offset-0 text-blue-500">{element.fileName}</a>)}
                        </div>
                        ))}
                  
                      </div>
                        
                    </div>
                    
                  </div>

          
                </div>

                <div class="flex flex-col border-2 border-solid border-gray-200 min-h[40%] h-auto w-[80%] m-auto my-0">
                  <p>Posts</p>
                        {classesLoaded && postsDocs.map((element) => ( 
                          <div class="relative border-2 border-black rounded-md min-h-[150px] mb-3 h-auto">
                            
                            <p class = "titleBox font-bold text-2xl" onClick={(event) => {onPostClick(event, element)}}>
                              {element.description} 
                            </p>

                            <div class = "absolute right-0 top-0 bg-green-600 py-1 px-2 rounded-md text-sm">
                              {element.date.toLocaleString()}
                            </div>

                            <div id = "typeBox" class = "bg-blue-30">Post</div>
                            {element.expanded && (<div class = "my-4 break-words">{element.description}</div>)}
                            {element.expanded && (<a href = {element.file} target="_blank" class = "break-words underline decoration-1 underline-offset-0 text-blue-500">{element.fileName}</a>)}
                            {deleteToggle && <button class = "text-red-600" onClick = {() => {onDeleteClick(element, "Post")}}><FontAwesomeIcon icon = {faTrash}/></button>}
                          </div>
                        ))}
                  
                  </div>

                

                

              </div>
            ) : (
              /*---------------------CREATE---------------------*/
              <div class="flex-row h-[1000px]">
                <div class="w-full h-full">
                  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full ml-auto m-2 h-[25px] w-[70px] text-sm" onClick={() => onCreateClick()}><FontAwesomeIcon icon = {faBackward}/> back </button>
                  <div class="border-2 border-solid border-gray-200 h-[80%] w-[1000px] m-auto">
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
                    <form>

                      {type === "default" ? <></>

                      :

                      type === "Quiz" ? 
                      /*---------------------Quiz---------------------*/

                      <div>
                        <label for = "title">
                          <div>
                            <p>Title</p> <p class = "error">{titleError}</p>
                          </div>
                          <input id = "title of quiz" class = "border-solid border-black border-2" onChange={(event) => setTitle(event.target.value)}/>
                        </label>
                      
                        <label for = "description">
                          <div>
                            <p>Description</p> <p class = "error">{descriptionError}</p>
                          </div>
                          <textarea id = "description" class = "border-solid border-black border-2" cols = "60" rows = "5" onChange={(event) => setDescription(event.target.value)}/>
                        </label>

                        <p class = "font-bold text-lg">Questions</p>
                        <fieldset>
                          <label for = "typeOfQuestion">
                            <select if = "typeofQuestion" class = "border-solid border-black border-2" onChange = {(event) => {setTypeOfQuestion(event.target.value)}}>
                              <option value = "default">Select a type of question</option>
                              <option value = "multipleChoice">Multiple Choice</option>
                              <option value = "shortAnswer">Short Answer</option>
                              <option value = "essay">Essay</option>
                            </select>
                          </label>

                          {typeOfQuestion === "multipleChoice" ? 
                            /*---------------------Multiple Choice---------------------*/
                            <fieldset id="questionCreationBox">
                              <label for = "question">
                                <p>Q{quizNumber}:</p>
                                <input id = "question" class = "border-solid border-black border-2" placeholder = "Question"/>
                              </label>

                              
                              <div>
                                <button type = "button" onClick = {()=>{numberOfChoices()}}>Add Choice</button>
                              </div>      
                            </fieldset>
                            
                            
                            : 
                        
                            /*---------------------Short Answer & Long answer---------------------*/
                            <></>}


                        </fieldset>

                      </div>

                      :
                      /*---------------------Announcement, Post, Lecture---------------------*/
                      <div>

                        <label for = "title" class = "p-0">
                          <div>
                            <p>Title</p> <p class = "error">{titleError}</p>
                          </div>
                          <input id = "title" class = "border-solid border-black border-2" onChange={(event) => setTitle(event.target.value)}/>
                        </label>

                        <label for = "description" class = "p-0">
                          <div>
                            <p>Description</p> <p class = "error">{descriptionError}</p>
                          </div>
                          <textarea id = "description" class = "border-solid border-black border-2" cols = "80" rows = "10" onChange={(event) => setDescription(event.target.value)}/>
                        </label>

                        <label for = "classImage" class = "p-0">Upload additional files: <input id = "classImage" type = "file" class = "text-xs" onChange={(event) => setFile(event.target.files)}></input></label>

                        <input type = "submit" class = "w-[30%] bg-black text-white rounded-md mt-10 m-2" onClick = {(event) => {onSubmit(event)}}/>
                      </div>
                       
                      
                    }



                    </form>
                  </div>
                
                </div>
              </div>
            )
          )}
        </div>
      );
}
