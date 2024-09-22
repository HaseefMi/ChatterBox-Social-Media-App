import React, { useState, useContext } from "react";
import { auth, createUserDocumentFromAuth } from '../../utils/firebase-utils'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user-context";
import { HomeAuth } from '../../contexts/home-auth-context';
import './sign-up.css'

const defaultFormFields = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  username: ''
};

function SignUp() {
  const navigate = useNavigate()
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { name, email, password, confirmPassword, username } = formFields;
  const {setUserName} = useContext(UserContext)
  const {setIsAuth} = useContext(HomeAuth)

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocumentFromAuth(user, {name, username});
      setUserName(username)
      setFormFields(defaultFormFields);
      setIsAuth(true)
      navigate('/home')

    } catch (error) {
      console.error("Error creating user: ", error);
      alert(error.message);
    }
  };

  return (
    <div className='sign-up-container'>
      <h2 className='sign-up-header'>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="sign-up-input-field">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            required
            name="name"
            value={name}
            onChange={handleChange}
          />
        </div>
        <div className="sign-up-input-field"> 
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="sign-up-input-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className="sign-up-input-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            required
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div className="sign-up-input-field">
          <label htmlFor="confirmPassword">Create Username</label>
          <input
            type="text"
            required
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className='sign-up-submit-button'>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
