import react from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Start from "./pages/Start";
import Home from "./pages/Home";
import UserProtectWrapper from "./wrapper/UserProtectWrapper";
import Logout from "./pages/Logout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./wrapper/CaptainProtectWrapper";
import CaptainLogout from "./pages/CaptainLogout";
import Riding from './pages/Riding'
import CaptainRiding from "./pages/CaptainRiding";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/riding" element={<Riding/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/captain-Riding" element={<CaptainRiding/>}/>
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
                <Home/>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/users/logout"
          element={
            <UserProtectWrapper>
              <Logout/>
            </UserProtectWrapper>
          }
        />
        <Route path="/captain-home" element={
          <CaptainProtectWrapper>
            <CaptainHome/>
          </CaptainProtectWrapper>
        }>
        </Route>
         <Route path="/captains/logout" element={
          <CaptainProtectWrapper>
            <CaptainLogout/>
          </CaptainProtectWrapper>
        }>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
