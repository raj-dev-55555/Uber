import React from "react";
import { Routes, Route } from 'react-router-dom'
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtected from "./pages/UserProtected";
import UserLogout from "./pages/UserLogout";
import Captainhome from "./pages/Captainhome";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";


function App(){

  return(
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/UserLogin" element={<UserLogin></UserLogin>}></Route>
        <Route path="/UserSignup" element={<UserSignup></UserSignup>}></Route>
        <Route path="/CaptainLogin" element={<CaptainLogin></CaptainLogin>}></Route>
        <Route path="/CaptainSignup" element={<CaptainSignup></CaptainSignup>}></Route>
        <Route path="/Home" element={<UserProtected><Home></Home></UserProtected>}></Route>
        <Route path="/riding" element={<Riding></Riding>}></Route>
        <Route path="/captainRiding" element={<CaptainRiding></CaptainRiding>}></Route>
        <Route path="/Userlogout" element={<UserLogout></UserLogout>}></Route>
        <Route path="/Captainhome" element={<CaptainProtectWrapper><Captainhome></Captainhome></CaptainProtectWrapper>} ></Route>
        {/* <Route path="/Captainhome" element={<Captainhome></Captainhome>}></Route> */}


        </Routes>
    </>
  )
}

export default App