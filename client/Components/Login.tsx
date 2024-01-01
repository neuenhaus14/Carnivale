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
        flexDirection: "column",
        position: "relative",
        backgroundColor: "white",
        textAlign: "center",
      }}>
      
      <img id="login-img" src="img/mask.png" alt="mask logo" width= "100px" height="140px" />
      <Button className="btn-login" style={{backgroundColor: "#e7abff" }} onClick={() => loginWithRedirect()}>Log In</Button>
      </div>
    </div>
  )
};

export default LoginButton;