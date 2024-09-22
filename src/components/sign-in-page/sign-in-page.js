import SignIn from "../sign-in/sign-in";
import SignUp from "../sign-up/sign-up";
import './sign-in-page.css'
function SignInPage() {
    return (
      <div className="container">
      <h1 className="title">ChatterBox Social Media App</h1>
      <div className="elements-container">
        <div className="sign-in"><SignUp /></div>
        <div className="sign-up"><SignIn /></div>
      </div>
      </div>
    )
}

export default SignInPage;