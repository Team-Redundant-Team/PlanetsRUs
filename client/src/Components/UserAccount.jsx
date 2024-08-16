import React, { useState, useEffect } from 'react';
import axios from 'axios';
import updateUserDetails from './updateUserDetails.jsx';
import Complaints from './Complaints.jsx';


const UserAccount = () => {
  const [user, setUser] = useState("");

  useEffect(()=>{
    try{
      const getUserData = async () => {
        const token = req.headers.authorization.split(" ")[1];
        const user = await axios.get('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          } // may not need lines 15-16 due to api deconstruct in server.cjs for the call
        })
        setUser(user);
      }
      getUserData();
    } catch (error){
      console.log('unable to get user data');
    }
  },[])

  return (
    <>
      <h1>Welcome {user.username}</h1>
        <updateUserDetails />
      <h2>Your Planets Owned</h2>
      <article>{/* List of planets owned can go here */}</article>
        <Complaints />
    </>
  );
};


export default UserAccount;