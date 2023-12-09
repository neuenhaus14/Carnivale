import React from "react";
import { useAuth0 } from "@auth0/auth0-react";//TODO: temporary
import { Link, To, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const handleNavigation = (path: To) => {
    navigate(path);
  };

  const { logout } = useAuth0();

  return (
    <div>
      <nav>
        <span>
          <button
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/homepage")}
          >
            Home Page
          </button>
        </span>
        <span>
          <button
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/mappage")}
          >
            Map
          </button>
        </span>
        <span>
          <button
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/feedpage")}
          >
            Feed
          </button>
        </span>
        <span>
          <button
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/userpage")}
          >
            UserPage
          </button>
        </span>
        {/* <span>
          <button
            type="button"
            id="navButton"
            onClick={() => handleNavigation("/photo")}
          >
            Photo
          </button>
        </span> */}
        <span>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        </span>
      </nav>
    </div>
  );
};
export default NavBar;
