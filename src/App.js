import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { set } from 'react-hook-form';
import { useState } from 'react';
import { SignUpPt2 } from './components/SignUpPt2';
import { Error } from './components/Error';
import { HomeAfterLogIn } from './components/HomeAfterLogIn';
import { auth, db } from './components/firebase';
import {useAuthState }from 'react-firebase-hooks/auth';
import { EmailVerify } from './components/EmailVerify';
import { createContext } from 'react';
import { query, where } from 'firebase/firestore';
import { getDocs, collection } from 'firebase/firestore';

export const userContext = React.createContext();

function App() {
  const [emailPassword, setEmailPassword] = useState([]);
  const [username] = useAuthState(auth);
  const [signedIn, setSignedIn] = useState(false);
  const [userQuerySnapshot, setUserQuerySnapshot] = useState(null);
  const [userType, setUserType] = useState(null);
  let studentQuerySnapshot;
  let teacherQuerySnapshot;


  const getQuery = async () => {
    if(username){
      studentQuerySnapshot = await getDocs(query(collection(db, "Students"), where("email", "==", username.email)));
      teacherQuerySnapshot = await getDocs(query(collection(db, "Teachers"), where("email", "==", username.email)));
      
      if(studentQuerySnapshot.size == 1){
        setUserType("Student");
        setUserQuerySnapshot(studentQuerySnapshot);
      }
      else{
        setUserType("Teacher");
        setUserQuerySnapshot(teacherQuerySnapshot);
        
      }
    }
  }




  return (
    <div className="z-0 App">
      <userContext.Provider value = {{username, userQuerySnapshot, getQuery, userType, signedIn, setSignedIn}}>
        <Router>
          <NavBar userType = {userType}/>
          <Routes>
            
        
            <Route path="/" element={ <Home/>} /> 
            <Route path="/SignUp" element={<SignUp setEmailPassword={setEmailPassword}/>} />
            <Route path="/SignUpPt2" element={<SignUpPt2 emailPassword={emailPassword} setEmailPassword={setEmailPassword}/>} />
            <Route path="/Home" element={<HomeAfterLogIn/>} />
            <Route path = "/login" element={<Login emailPassword={emailPassword} setEmailPassword={setEmailPassword}/>}/>
            <Route path = "emailverify" element={<EmailVerify/>}/>

          </Routes>
        </Router>
      </userContext.Provider>
    </div>
  );
}

export default App;
