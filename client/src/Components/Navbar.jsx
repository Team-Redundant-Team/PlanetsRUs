import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // const { token, setToken } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/planets">Planets</Link>
      <Link to="/auth">Login</Link>
    </nav>
  );
}

export default Navbar;
