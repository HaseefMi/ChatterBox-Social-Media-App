import SignIn from "../sign-in/sign-in";
import SignUp from "../sign-up/sign-up";
import Logo from '../../assets/chatterbox-logo.png'
import './sign-in-page.css'
import { useState } from "react";
function SignInPage() {
  const [show, setShow] = useState(true);
    return (
      <div className="container">
        <div className="logo-container">
        <h1 className="title">ChatterBox | Social Media Reinvented</h1>
          <img src={Logo} alt="ChatterBox Logo" className="logo" />
          </div>
      <div className="elements-container">
        <div className="sign-in">
          {show && <SignIn />}
          {!show && <SignUp />}
          <button className="auth-button" onClick={() => setShow(!show)}>{show ? "Don't Have an Account?" : 'Already Have an Account?'}</button>
        </div>
      </div>
      </div>
    )
}

export default SignInPage;