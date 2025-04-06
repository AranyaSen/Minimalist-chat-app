import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/userContext.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import Signup from "./components/SignupPage/Signup.jsx";
import SignIn from "./components/SinginPage/SignIn";
import Users from "./components/UsersPage/Users";
import Texting from "./components/TextingPage/Texting";

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={LandingPage} />
            <Route path="/signup" Component={Signup} />
            <Route path="/signin" Component={SignIn} />
            <Route path="/users" Component={Users} />
            <Route path="/texting" Component={Texting} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
