import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import updateUserDetails from './updateUserDetails';


const UserAccount = () => {

  return (
    <>
      <h1>User Account</h1>
        <updateUserDetails />
      <h2>Planets Owned</h2>
      <ul>
        {/* List of planets owned can go here */}
      </ul>
    </>
  );
};


export default UserAccount;