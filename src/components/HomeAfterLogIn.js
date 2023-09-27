import React, {useContext} from 'react'
import { userContext } from '../App'
import { useEffect } from 'react';


export const HomeAfterLogIn = () => {
  const {username} = useContext(userContext);
  const {getQuery} = React.useContext(userContext); 
  let userData;

  console.log(username);
  
  const getData = async () => {
    const querySnapshot = await getQuery();
    userData = querySnapshot.docs[0].data();
    console.log(userData);
  }

  useEffect(() => {
    getData();
  }, [])

  

 
  return (
    <>
    {userData && userData.typeOfUser === "Student" ? <>Student</> : <>Teacher</>}
    </>
  )
}
