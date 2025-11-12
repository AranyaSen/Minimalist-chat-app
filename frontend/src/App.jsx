import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/userContext.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Signup from "./pages/SignupPage/Signup.jsx";
import SignIn from "./pages/SinginPage/SignIn";
import Users from "./pages/UsersPage/Users";
import Texting from "./components/Texting/Texting.jsx";

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
