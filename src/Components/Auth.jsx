import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth= (setToken)=> {
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");g
  const [passwordInput, setPasswordInput] = useState("");
  const [secondaryPasswordInput, setSecondaryPasswordInput] = useState("");
  const [showLogin, setShowLogin]= usestate(true)
  
  const navigate = useNavigate();
  
  const registerUser = async(event) => {
    event.preventDefault();
    if (passwordInput === secondaryPasswordInput) {
      try {
        const response = await axios.post('api/login', {
          username: usernameInput,
          email: emailInput,
          password: passwordInput
        })
          console.log(response);
          navigate('/login');
        } catch(error){
        console.log(error);
      }
  
      setUsernameInput("");
      setEmailInput("");
      setPasswordInput("");
      setSecondaryPasswordInput("");
    }
  
  const logInUser = async(event) => {
    event.preventDefault();
    try {
      const response = await axios.post('./api/login', {
        username: usernameInput,
        password: passwordInput
      });
    
      setToken(response.data);
      navigate('/planets');
      } catch (error){
        console.log(error);
      }
  }

  
    return 
      <>
        <form>
          <input value={usernameInput} onChange={(event) => { setUsernameInput(event.target.value) }} type="text" placeholder="username" required /> <br />
          <input value={passwordInput} onChange={(event) => { setPasswordInput(event.target.value) }} type="password" placeholder="password" required /> <br />
          {
            showLogin? null: <><input value={secondaryPasswordInput} onChange={(event) => { setSecondaryPasswordInput(event.target.value) }} type="password" placeholder="password" required /> 
            <input value={emailInput} onChange={(event) => { setEmailInput(event.target.value) }} type="email" placeholder="email" required /></>
            
          }
          { 
            showLogin? 
            <><button onClick={logInUser}>Log In</button><br /> 
            <button onClick={() => {setShowLogin(false)}}>Not a User? Sign up HERE</button> </>: 
            <>
            <button onClick={registerUser}>Sign up</button> 
            <button onClick={() => {setShowLogin(true)}}>Already a User? Login</button>
          </>
          }
        </form>
      </>
  }
}
export default Auth