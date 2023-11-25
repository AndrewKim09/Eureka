import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { useState } from 'react';
import { SignUpPt2 } from './components/SignUpPt2';
import { Error } from './components/Error';
import { HomeAfterLogIn } from './components/HomeAfterLogIn';
import { auth, db } from './components/firebase';
import {useAuthState }from 'react-firebase-hooks/auth';
import { EmailVerify } from './components/EmailVerify';
import { query, where } from 'firebase/firestore';
import { getDocs, collection } from 'firebase/firestore';
import { CreateTest } from './components/TestComponents/CreateTest';
import {Class} from './components/ClassComponents/Class';
import { AddAssignment } from './components/AddAssignment';
import { QuizDetails } from './components/ClassComponents/QuizDetails';
import { StudentList } from './components/ClassComponents/StudentList';
import { AddStudent } from './components/ClassComponents/AddStudent';
import { CheckAnswersTeacher } from './components/ClassComponents/CheckAnswersTeacher';
import { StudentAnswer } from './components/ClassComponents/StudentAnswer';
import { StudentReview } from './components/ClassComponents/StudentReview';

export const userContext = React.createContext();

function App() {
  const [emailPassword, setEmailPassword] = useState([]);
  const [username] = useAuthState(auth);
  const [signedIn, setSignedIn] = useState(false);
  const [userQuerySnapshot, setUserQuerySnapshot] = useState(null);

  const getQuery = async (email) => {
    if(username || email){
      const userEmail = email || (username ? username.email : null)


      const studentQuerySnapshot = await getDocs(query(collection(db, "Students"), where("email", "==", userEmail)));
      const teacherQuerySnapshot = await getDocs(query(collection(db, "Teachers"), where("email", "==", userEmail)));
      
      
      
      if(studentQuerySnapshot.size == 1){
        return(studentQuerySnapshot);
      }
      else if (teacherQuerySnapshot.size == 1){
        return(teacherQuerySnapshot);
        
      }
      else{
        return( await getDocs(query(collection(db, "users"), where("email", "==", username.email))));
      }
    }
    else{
      return ("get query error")
    }

  }

  useEffect(() => {

  }, [userQuerySnapshot])




  return (
    <div className="z-0 App">
      <userContext.Provider value = {{getQuery, signedIn, setSignedIn, userQuerySnapshot, username}}>
        <Router>
          <div class = "h-14">&nbsp;</div>
          <NavBar/>
          <Routes>
            
        
            <Route path="/" element={ username? <HomeAfterLogIn/> : <Home/>} /> 
            <Route path="/SignUp" element={<SignUp setEmailPassword={setEmailPassword}/>} />
            <Route path="/SignUpPt2" element={<SignUpPt2 emailPassword={emailPassword} setEmailPassword={setEmailPassword}/>} />
            <Route path = "/login" element={<Login emailPassword={emailPassword} setEmailPassword={setEmailPassword}/>}/>
            <Route path = "emailverify" element={<EmailVerify/>}/>
            <Route path = "/create" element={<CreateTest/>}/>
            <Route path = "/class/:classID/add" element={<AddAssignment/>}/>
            <Route path = "/class/:classID" element={<Class userQuerySnapshot= {userQuerySnapshot}/>}/>
            <Route path = "/class/:classID/quiz/:quizID" element={<QuizDetails/>}/>
            <Route path = "/class/:classID/studentList" element = {<StudentList/>}/>
            <Route path = "/class/:classID/studentList/addStudent" element = {<AddStudent/>}/>
            <Route path = "/class/:classID/quiz/:quizID/answers" element={<CheckAnswersTeacher/>}/>
            <Route path = "/class/:classID/quiz/:quizID/answers/:studentID" element={<StudentAnswer/>}/>
            <Route path = "/class/:classID/quiz/:quizID/answer/:studentAnswerID" element={<StudentReview/>}/>
            <Route path = "*" element={<Error/>}/>
          </Routes>
        </Router>
      </userContext.Provider>
    </div>
  );
}

export default App;
