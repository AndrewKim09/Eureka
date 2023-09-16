
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { set } from 'react-hook-form';
import { useState } from 'react';
import { SignUpPt2 } from './components/SignUpPt2';

function App() {
  const [emailPassword, setEmailPassword] = useState([]);

  return (
    <div className="z-0 App">
      <Router>
        <NavBar/>
        <Routes>

          <Route path="/" element={<Navigate to="/Home"/>} /> 
          <Route path="/SignUp" element={<SignUp setEmailPassword={setEmailPassword}/>} />
          <Route path="/SignUpPt2" element={<SignUpPt2 emailPassword={emailPassword} setEmailPassword={setEmailPassword}/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path = "/login" element={<Login/>}/>
          

        </Routes>
      </Router>
    </div>
  );
}

export default App;
//q: why is my Login component not rendering?
//a: I was using component instead of element in the Route tag