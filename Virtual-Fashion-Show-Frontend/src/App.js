import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Login from './components/login.component';
import SignUp from './components/signup.component';
import SignUpDesigner from "./components/signupdesigner.component";
import Userdash from "./components/userdash";
import Designer from "./components/designerdash";
import LiveShow from "./components/liveshow";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>              
              {/* <Route exact path="/" element={isLoggedIn==="true"?(userType === "user" ? <UserDetails /> : <Upload/>) : <Login />} /> */}
              <Route exact path="/" element={<Login/>} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-up-designer" element={<SignUpDesigner />} />
              <Route path="/designerdash" element={<Designer/>} />
              <Route path="/userdash" element={<Userdash/>} />
              <Route path="/liveshow" element={<LiveShow/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
