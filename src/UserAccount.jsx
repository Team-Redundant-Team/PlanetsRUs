import React from 'react';
import {useState} from 'react';
import axios from 'axios';


const UserAccount = () => {
  const [emailInput, setEmailInput]= useState('');
  const [passwordInput, setPasswordInput]= useState('');
  const [secondaryPasswordInput, setSecondaryPasswordInput]= useState('');
    
  const changeEmail= async(event)=> {
    event.preventDefault();
    try{
      const response= await axios.put('/api/change-email', {email: emailInput})
    }catch(err) {
      console.log(err);
    }
    
    }

  const changePW=  async(event)=> {
    event.preventDefault();
    if(passwordInput===secondaryPasswordInput){
      try{
        const response= await axios.put('/api/change-pw', {password: passwordInput})
      }catch(err) {
        console.log(err)
        }
      }
      else{
        alert('Passwords do not match, Please try again!');
      }
    
    }
    


  return (
    <>
      <h1>User Account</h1>
      <input type="email" value={emailInput} onChange={(event)=>{setEmailInput(event.target.value)}} placeholder='"Enter New Email' />
      <button onClick={()=>{changeEmail()}}>Change Email</button>
      <input type="password" value={emailInput} onChange={(event)=>{setPasswordInput(event.target.value)}} placeholder='"Enter New Password' />
      <button onClick={()=>{changePW()}}>Change Password</button>
      <h2>Planets Owned</h2>
      <ul>
        {/* List of planets owned can go here */}
      </ul>
    </>
  );
};


export default UserAccount;