import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Login = ( { setToken } ) => {

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const navigate = useNavigate();

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

  return <>
            <form>
              <input value={usernameInput} onChange={(event) => { setUsernameInput(event.target.value) }} type="text" placeholder="username" required /> <br />
              <input value={passwordInput} onChange={(event) => { setPasswordInput(event.target.value) }} type="password" placeholder="password" required /> <br />

              <button onClick={logInUser}>Log In</button> <br />
              <button onClick={() => {navigate('/signup')}}>Not a User? Sign up HERE</button>
              {/* Navigate button for register will not work without modification to server.cjs to make the route & making the signup component */}
            </form>
        </>
}

export default Login