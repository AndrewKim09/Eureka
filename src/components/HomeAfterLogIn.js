import React, {useContext} from 'react'
import { userContext } from '../App'
import { useEffect } from 'react';
import { useState } from 'react';


export const HomeAfterLogIn = () => {
  const {username} = useContext(userContext);
  const {getQuery} = React.useContext(userContext); 
  const {userQuerySnapshot} = React.useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  console.log(username)

  
  const getData = async () => {
    await getQuery();
    setUserData(userQuerySnapshot.docs[0].data());
    console.log(userData)
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

    
  return (
    <>
    {loading ? <div>Loading...</div> :
    <div id = "HomePage">
          {userData && userData.typeOfUser == "Student" ? <div>Student</div> : <div>Teacher</div>}
    </div>
}
    </>

  );

}
