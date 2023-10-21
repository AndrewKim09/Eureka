import React from 'react'
import { userContext } from '../App';
import { useState } from 'react';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export const GetUser = () => {
    const {getQuery} = React.useContext(userContext);
    const [userQuerySnapshot, setUserQuerySnapshot] = useState(null);
    const [userdata, setUserdata] = useState(null);
    const [username] = useAuthState(auth);
  
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
  
  
  return{

  }

}

