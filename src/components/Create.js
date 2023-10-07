import React from 'react'
import { useContext } from 'react';
import { userContext } from '../App'
import { collection } from 'firebase/firestore';
import { db } from './firebase';

export const Create = () => {
    const {userQuerySnapshot} = React.useContext(userContext);
    const teacherClassCollection = collection(db, "Classes");

    if(userQuerySnapshot){
      console.log(userQuerySnapshot.docs[0].data())
    }

  return (
    <div></div>
  )
}
