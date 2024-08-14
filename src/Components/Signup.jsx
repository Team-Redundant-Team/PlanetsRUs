import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Signup = () => {

  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");g
  const [passwordInput, setPasswordInput] = useState("");
  const [secondaryPasswordInput, setSecondaryPasswordInput] = useState("");

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
  }

  return <>
          <form>
              <input value={usernameInput} onChange={(event) => { setUsernameInput(event.target.value) }} type="text" placeholder="username" required /> <br />
              <input value={emailInput} onChange={(event) => { setPasswordInput(event.target.value) }} type="password" placeholder="password" required /> <br />
              <input value={passwordInput} onChange={(event) => { setPasswordInput(event.target.value) }} type="password" placeholder="password" required /> <br />
              <input value={secondaryPasswordInput} onChange={(event) => { setSecondaryPasswordInput(event.target.value) }} type="password" placeholder="password" required /> <br />

              <button onClick={registerUser}>Sign up</button> <br />
              <button onClick={() => {navigate('/login')}}>Already a User? Go to Login</button>
              {/* Navigate button to return to login will not work without modification to server.cjs to make the route*/}
          </form>
        </>
}

export default Signup