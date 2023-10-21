import React from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useState } from 'react'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { set } from 'react-hook-form';


export const CreateTest = () => {
    const navigate = useNavigate();
    const teacherClasses = collection(db, "Classes")
    const [className, setClassName] = useState("")
    const [classImage, setClassImage] = useState();
    const [season, setSeason] = useState("Fall")

    const [classNameError, setClassNameError] = useState("")
    const [classImageError, setClassImageError] = useState("");
    
    const storage = getStorage();

    function getFileExtension(fileName){
        var  fileExtension;
        fileExtension = fileName.replace(/^.*\./, '');
        return fileExtension;
    }
    function isImage(fileName){
        var fileExt = getFileExtension(fileName);
        var imagesExtension = ["png", "jpg", "jpeg"];
        if(imagesExtension.indexOf(fileExt) !== -1){
            return true;
        } else{
            return false;
        }
    }

    const onSubmit = async () => {
        try{

        setClassNameError("");
        setClassImageError("");

        if(className !== ""){
            if(classImage && isImage(classImage[0].name)){
            }
            else{
                setClassImageError("Please upload an image of png, jpg, or jpeg format")
                return;
            }
        }
        else{
            setClassNameError("Please enter a class name")
            return;
        }

        const storageRef = ref(storage, 'images/classImages/' + classImage[0].name);
        console.log("Submitted")

        console.log(className);
        console.log(classImage[0]);
        console.log(season);
        
        await uploadBytes(storageRef, classImage[0]);

        getDownloadURL(storageRef).then((url) => {
            addDoc(teacherClasses, {
                email: "andrewkim418@gmail.com",
                className,
                classImage: url,
                season,
            })
            navigate("/")
            
        })
        .catch((error) => {
            console.log("error uploading image: " + error)
        })

        }
        catch(error){
            console.log("setting values error: " + error)
        }
    }
  return (
    
        <form class = "flex flex-col w-[500px] h-[400px] items-center border-solid border-black border-2 m-auto mt-10 rounded-xl">
            <fieldset>
                <label for = "className" class = "block"><p class = "error">{classNameError ? classNameError : " "}</p>Class Name: <input onChange={(event) => {setClassName(event.target.value)}} id = "className" class = "border-solid border-2 border-black"/></label>
                <label for = "classImage"><p class = "error">{classImageError ? classImageError: " "}</p>Upload class image: <input onChange={(event) => {setClassImage((event.target.files))}} id = "classImage" type = "file" class = "text-xs"></input></label>
                <label for = "season">Season <select id = "season" class = "border-solid border-black border-2" onChange={(event) => {setSeason(event.target.value)}}>
                    <option value = "Fall">Fall</option>
                    <option value = "Winter">Winter</option>
                    <option value = "fullYear">full Year</option>
                    
                    
                    </select></label>
                
            </fieldset>
            <input type = "submit" class = "w-[30%] bg-black text-white rounded-md mt-10" onClick = {onSubmit}/>
        </form>

  )
}
