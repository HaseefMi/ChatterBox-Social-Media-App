import SignInPage from "./components/sign-in-page/sign-in-page";
import HomePage from "./components/home/home-page";
import { Route, Routes } from "react-router-dom";
import { HomeAuthProvider } from "./contexts/home-auth-context";
import Profile from "./components/profile/profile";
import CreatePost from "./components/create-post/post";

function App() {
  return (
    <HomeAuthProvider>
    <Routes>
    <Route path='/' element={<SignInPage />} />
    <Route path='/home' element={<HomePage />} />
    <Route path='/profile' element={<Profile />} />
    <Route path='/create-post' element={<CreatePost />} />
    </Routes>
    </HomeAuthProvider>
  );
}

export default App;
