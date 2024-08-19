import React, { useState, useEffect } from 'react';
import UpdateUserDetails from './updateUserDetails.jsx';
import { useNavigate } from 'react-router-dom';
import isAuthenticated from './tokencheck.jsx';



const UserAccount = () => {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try{
        const response = await fetch('/api/user-account', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if(response.ok) {
          const data = await response.json();
          console.log(data);
          setUserName(data.username);

        }else {
          navigate('/auth');
        }

      }catch(err){
        console.log('failed to fetch data', err);
        navigate('/auth');
      }
    }

    fetchUserData();
  },[navigate]);

  return (
    <>
     {userName ? <h1>Welcome to Space {userName}</h1> : <h2>Still Loading.....</h2>}
        <UpdateUserDetails />
      <h2>Your Planets Owned</h2>
      <article>{/* planets owned will go here */}</article>
      
     
    </>
  );
};


export default UserAccount;