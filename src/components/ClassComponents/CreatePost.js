import React from 'react'
import { useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { uploadBytes } from 'firebase/storage';
import {ref, getDownloadURL} from 'firebase/storage';
import {addDoc, collection} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export const CreatePost = ({titleError, setTitle, setDescription, setFile, descriptionError, onSubmit}) => {



  return (
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
                       
  )
}
