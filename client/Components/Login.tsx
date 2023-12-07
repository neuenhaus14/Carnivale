import React from 'react';
import { Button } from 'react-bootstrap';
import {To, useNavigate} from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const handleNavigation = (Path: To) => {
    navigate(Path);
  }

  return (
    <div>
      <h1>Login!</h1>
      <Button onClick={() => handleNavigation('/auth')}>Login</Button>
    </div>
)

};

export default Login;