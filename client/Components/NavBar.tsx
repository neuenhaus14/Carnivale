import React from 'react';

import {Link, To, useNavigate} from 'react-router-dom';

const NavBar = () => {
  
  
  
  const navigate = useNavigate();
  const handleNavigation = (path: To) => {
    navigate(path);
  }

  return (
    <div>
      <nav>  
        <span>
          <button type="button" id="navButton" onClick={() => handleNavigation('/homepage')}>
            Home Page
          </button>
        </span>
        <span>
          <button type="button" id="navButton" onClick={() => handleNavigation('/mappage')}>
            Map
          </button>
        </span>
        <span>
          <button type="button" id="navButton" onClick={() => handleNavigation('/feedpage')}>
            Feed
          </button>
        </span>
        <span>
          <button type="button" id="navButton" onClick={() => handleNavigation('/userpage')}>
            UserPage
          </button>
        </span>
      </nav>
    </div>
  )
  
}
  export default NavBar;