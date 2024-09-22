import { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, createUserDocumentFromAuth, signInWithGoogle } from '../../utils/firebase-utils';
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context'; 
import { HomeAuth } from '../../contexts/home-auth-context';
import './sign-in.css';

const defaultFormFields = {
  email: '',
  password: '',
};

function SignIn() {
  const navigate = useNavigate();
  const { setUserName } = useContext(UserContext);
  const {setIsAuth} = useContext(HomeAuth)
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        setUserName(userDoc.data().username)
      }
      else {
        alert("No User Exists")
      }
      setIsAuth(true)
      navigate('/home');
      console.log(user)
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-credential':
          alert('Incorrect Email or Password');
          break;
        case 'auth/user-not-found':
          alert('No User Exists with Entered Email');
          break;
        default:
          console.log(error);
      }
    }
  };

  const googleSignIn = async () => {
    const result = await signInWithGoogle();
    await createUserDocumentFromAuth(result);
    setIsAuth(true)
  };

  return (
    <div className="sign-in-container">
      <h2 className="sign-in-header">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="sign-in-input-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="sign-in-input-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="sign-in-submit-button">
          Sign In
        </button>
        <button
          type="button"
          className="google-sign-in-submit-button"
          onClick={googleSignIn}
        >
          Google Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;
