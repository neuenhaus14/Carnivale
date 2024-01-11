import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

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
      <img id="login-img" src="img/mask.png" alt="mask logo" width= "100%" height="auto" />
      <h3>One stop shop for managing the chaos of Mardi Gras.</h3>
      <h4>Share gossip, costumes, throws, drop pins with hot commodities, create events with your friends, checkout local music, and lookup parade schedules!</h4><br />
      <Button className="btn-login" style={{backgroundColor: "#e7abff" }} onClick={() => loginWithRedirect()}>Log In</Button>
      </div>
    </div>
  )
};

export default LoginButton;