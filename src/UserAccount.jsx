import React from 'react';
import {useState} from 'react';
import axios from 'axios';

const UserAccount = () => {
  const [emailInput, setEmailInput]= useState('')

    const changeEmail= async(emailInput)=> {
      try{
        const response= await axios.put('/api/change-email', {email: emailInput})
      }catch(err) {
          console.log(err);
        }
    
    }
    
    
    console.log("changeEmail function called");


  return (
    <>
      <h1>User Account</h1>
      <input type="email" value={emailInput} onChange={(event)=>{setEmailInput(event.target.value)}} placeholder='"Enter New Email' />
      <button onClick={()=>{changeEmail()}}>Change Email</button>
      <h2>Change Password</h2>
      <h2>Planets Owned</h2>
      <ul>
        {/* List of planets owned can go here */}
      </ul>
    </>
  );
};

// const emailChanger= ()=> {
//   const [email, setEmail]= useState('');
//   const [newEmail, setNewEmail]= useState('');

//   const handleChangeEmail= ()=> {
//     if (newEmail) {
//       setEmail(newEmail);
//       setNewEmail('');
//     }
//   };
  
//   const handleInputChange= (e)=> {
//     setNewEmail(e.target.value);
//   };

//   return (
//     <>
//     <h1>current Email: {email}</h1>
//     <input type="email" value={newEmail} onChange={handleInputChange} placeholder='"Enter New Email' />
//     <button onClick= {handleChangeEmail}>Change Email</button>
//     </>
//   )
// }
export default UserAccount;