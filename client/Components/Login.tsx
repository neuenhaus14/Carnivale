import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const navigate = useNavigate();

  return (
    <div id="login">
      <div style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignContent: 'center',
        flexDirection: "column",
        position: "relative",
        backgroundColor:"#fffcf8",
        textAlign: "center",
        paddingBottom: "2rem",
      }}>
      <h1>OPEN BETA</h1>
      <img id="login-img" src="img/jesterPin.png" alt="jester pin logo" width= "100%" height="auto" />

      <h3>One stop shop for managing the chaos of Mardi Gras.</h3>
      <h4>Share gossip, costumes, throws, drop pins with hot commodities, create events with your friends, checkout local music, and lookup parade schedules!</h4>
      <p>Take the <a href="https://docs.google.com/forms/d/e/1FAIpQLSfSGLNva3elpadLqpXw1WuD9b4H39lBuX6YMiKT5_o2DNQ7Gg/viewform">Survey</a> and let us know what you think!</p>
      <p>Like what you see?  Support us on <a href="https://www.kickstarter.com">Kickstarter</a></p><br />
      <p className='disclaimer'>Pardigras.org is a beta website and is still in the beginning stages. We DO NOT use your location and user information for monetary gain. By logging in you agree to forfeit litigation against the website or creators. </p>
      <Button className="btn-login" style={{backgroundColor: "#e7abff" }} onClick={() => loginWithRedirect()}>Log In</Button>
      </div>
    </div>
  );
};

export default LoginButton;
