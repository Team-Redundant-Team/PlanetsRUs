import { Routes, Route, Link} from "react-router-dom"
import LoginPage from './loginPage.jsx'
import PlanetsPage from './planetsPage.jsx'
import { AuthContext } from '../../AuthContext.js'
import React, { useContext } from 'react';


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
    </Routes>

      

    </>
  )
}

export default Navbar