import React from 'react'
import { useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useParams} from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref,deleteObject } from "firebase/storage";




export const ClassHomePage = ({createState, setCreateState, db, storage, announcementsDocs, postsDocs, lecturesDocs, classesLoaded}) => {

  const {classID} = useParams();
  const [update, setUpdate] = useState(false)
  const [deleteToggle, setDeleteToggle] = useState(false)

  //----FUNCTIONS-----//

  const onDeleteButtonClick = (event) => {
    event.currentTarget.classList.toggle("deleteToggle")
    setDeleteToggle(!deleteToggle)
  }
  
  const onDeleteClick = (element, type) => {
    try{
      console.log(db)
      const docRef = doc(db, `posts/${classID}/${type}/${element.id}`)
      const imageRef = ref(storage, `posts/files/${element.fileName}`)
      console.log(imageRef)
      if(element.file){
        deleteObject(imageRef)
      }
      console.log(docRef)
      deleteDoc(docRef)
    }
    catch(error){
      console.log("onDeleteClick Error: " + error)
    }

  }

  const onCreateClick = () => {
    if(createState){
        window.location.reload();
    }
      setCreateState(!createState);
  }

  const onPostClick = (event, element) => {
    setUpdate(!update)
    element.expanded = !element.expanded
    event.currentTarget.parentElement.classList.toggle("expanded")
    
  }


  
  //----------------------------------USE EFFECTS ----------------------------------//
    
  return (
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
                            {deleteToggle &&<button class = "text-red-600" onClick = {() => {onDeleteClick(element, "Announcement")}}><FontAwesomeIcon icon = {faTrash}/></button>}
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
  )
}
