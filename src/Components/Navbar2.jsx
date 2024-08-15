import { Routes, Route, Link} from "react-router-dom"
// import LoginPage from './loginPage.jsx'
// import PlanetsPage from './planetsPage.jsx'
import { AuthContext } from '../../AuthContext.jsx'
import React, { useContext } from 'react';
import UserAccount from "../../UserAccount.jsx"

const Navbar = () => {
  const { token, setToken }=useContext(AuthContext);
  return(
    <>
    
      <nav>

        <Link to = '/'>Home</Link>
        <Link to = '/planets'>Planets</Link>
        <Link to = '/login'>Login</Link>

      </nav>

    <Routes>
      <Route path="/" element="../index.html"/>
      <Route path="planets" element={<PlanetsPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/account" element={<UserAccount/>}/>
    </Routes>

      

    </>
  )
}

export default Navbar