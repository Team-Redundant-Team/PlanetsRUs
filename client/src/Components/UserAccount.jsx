import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateUserDetails from './updateUserDetails.jsx';
import { useNavigate } from 'react-router-dom';



const UserAccount = () => {
  const [user, setUser] = useState("");
  


  // useEffect(()=>{
  //   try{
  //     const getUserData = async () => {
  //       const token = axios.headers.authorization.split(" ")[1];
  //       const response = await axios.get('/api/users', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         } // may not need lines 15-16 due to api deconstruct in server.cjs for the call
  //       })
  //       setUser(response);
  //     }
  //     getUserData();
  //   } catch (error){
  //     console.log('unable to get user data');
  //   }
  // },[])

  return (
    <>
     <h1>Welcome {user.username}</h1>
        <UpdateUserDetails />
      <h2>Your Planets Owned</h2>
      <article>{/* List of planets owned can go here */}</article>
      
     
    </>
  );
};


export default UserAccount;