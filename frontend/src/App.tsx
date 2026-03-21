import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage/LandingPage";
import Signup from "@/pages/SignupPage/Signup";
import SignIn from "@/pages/SinginPage/SignIn";
import Users from "@/pages/UsersPage/Users";
import Texting from "@/components/Texting/Texting";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/users" element={<Users />} />
          <Route path="/texting" element={<Texting receiverId="" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
