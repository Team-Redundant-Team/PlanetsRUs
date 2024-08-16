import { useState } from "react";

const updateUserDetails = () => {
  const [emailInput, setEmailInput]= useState('');
  const [passwordInput, setPasswordInput]= useState('');
  const [secondaryPasswordInput, setSecondaryPasswordInput]= useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
    
  const changeEmail = async(event) => {
    event.preventDefault();
      try{
        const response = await axios.put('/api/change-email', {email: emailInput})
      }catch(err) {
        console.log(err);
      }
    }

  const changePW = async(event) => {
    event.preventDefault();
    if(passwordInput === secondaryPasswordInput){
      try{
        const response = await axios.put('/api/change-pw', {password: passwordInput})
      }catch(err) {
        console.log(err)
      }
    } else{
      alert('Passwords do not match, Please try again!');
    }
  }

  return (
    <>
      {showChangeEmail ?
      <form>
      <input type="email" value={emailInput} onChange={(event)=>{setEmailInput(event.target.value)}} placeholder='"Enter New Email' /> <br />
      <button onClick={() => {changeEmail()}}>Change Email</button>
      </form> 
      :
      <button onClick={() => {setShowChangeEmail(true)}}>Want to change your Email?</button>
      }

      {showChangePassword ?
      <form>
      <input type="password" value={passwordInput} onChange={(event)=>{setPasswordInput(event.target.value)}} placeholder='"Enter New Password' /> <br />
      <input type="password" value={secondaryPasswordInput} onChange={(event)=>{setSecondaryPasswordInput(event.target.value)}} placeholder='"Enter New Password Again' /> <br />
      <button onClick={()=>{changePW()}}>Change Password</button>
      </form>
      :
      <button onClick={() => {setShowChangePassword(true)}}>Want to change your Email?</button>
      }
    </>
  )
}

export default updateUserDetails