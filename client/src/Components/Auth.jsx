import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import './Login.css'; // Import the CSS file

const Auth = () => { 
  const { token, setToken } = useContext(AuthContext);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [secondaryPasswordInput, setSecondaryPasswordInput] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const navigate = useNavigate();

  const registerUser = async () => {
    if (passwordInput === secondaryPasswordInput) {
      try {
        const response = await axios.post('/api/register', {
          username: usernameInput,
          password: passwordInput,
          email: emailInput,
        });
        console.log(response);
        setShowLogin(true);
      } catch (error) {
        console.log(error);
      }

      setUsernameInput("");
      setEmailInput("");
      setPasswordInput("");
      setSecondaryPasswordInput("");
    }
  };

  const logInUser = async () => {
    try {
      const response = await axios.post('/api/login', {
        username: usernameInput,
        password: passwordInput,
      });

      if (response.status === 200) {
        setToken(response.data.token);
        navigate('/planets')
        localStorage.setItem('authToken', response.data.token); 
      } else {
        console.log(`Login failed:`, response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h1>{showLogin ? 'Login Page' : 'Register Page'}</h1>
      <form>
        <input value={usernameInput} onChange={(event) => setUsernameInput(event.target.value)} type="text" placeholder="username" required /> 
        <br />
        <input value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)} type="password" placeholder="password" required />
        <br />
        {!showLogin && ( 
          <>
            <input value={secondaryPasswordInput} onChange={(event) => setSecondaryPasswordInput(event.target.value)} type="password" placeholder="confirm password" required /> 
            <input value={emailInput} onChange={(event) => setEmailInput(event.target.value)} type="email" placeholder="email" required />
          </>
        )}
        {showLogin ? (
          <>
            <button type="button" onClick={logInUser}>Log In</button>
            <br /> 
            <button type="button" className="switch-link" onClick={() => setShowLogin(false)}>
              Not a User? Sign up HERE
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={registerUser}>Sign up</button>
            <br /> 
            <button type="button" className="switch-link" onClick={() => setShowLogin(true)}>Already a User? Login</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Auth;
