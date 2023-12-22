import React from "react";
import { useAuth0 } from "@auth0/auth0-react"; //TODO: temporary
import { Link, To, useNavigate } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';


const NavBar = () => {
  const navigate = useNavigate();
  const handleNavigation = (path: To) => {
    navigate(path);
  };

  const { logout } = useAuth0();

  return (
      <Navbar fixed="bottom" className="bottom-nav">

          <button
            className="bottom-nav-button"
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/homepage")}
          >
            HP
          </button>

          <button
          className="bottom-nav-button"
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/mappage")}
          >
            M
          </button>

          <button
          className="bottom-nav-button"
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/feedpage")}
          >
            F
          </button>

          <button
            className="bottom-nav-button"
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/userpage")}
          >
            UP
          </button>

        {/* <span>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        </span> */}
      </Navbar>

  );
};
export default NavBar;
