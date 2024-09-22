import SignInPage from "./components/sign-in-page/sign-in-page";
import HomePage from "./components/home/home-page";
import { Route, Routes } from "react-router-dom";
import { HomeAuthProvider } from "./contexts/home-auth-context";
function App() {
  return (
    <HomeAuthProvider>
    <Routes>
    <Route path='/' element={<SignInPage />} />
    <Route path='/home' element={<HomePage />} />
    </Routes>
    </HomeAuthProvider>
  );
}

export default App;
