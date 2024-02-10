import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

import { To, useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const navigate = useNavigate();

  const handleNavigation = (path: To) => {
    navigate(path);
  };

  const [mailingListInfo, setMailingListInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [formEmailAlert, setFormEmailAlert] = useState({
    isDisplayed : false,
    text: '',
    variant: ''
  })

  const validateEmail = function(email : string) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
  };

  // add mailing list info from client to Atlas db
  const addToMailingList = async () => {
    try {
      if (validateEmail(mailingListInfo.email)) {
        // console.log('email valid')
        await axios.post('/api/mail/addToMailList', mailingListInfo)
        setFormEmailAlert({
          isDisplayed: true,
          text: 'Thanks! You\'re on the list!',
          variant: 'success'
        });
      } else {
        console.log('email invalid');
        setFormEmailAlert({
          isDisplayed: true,
          text: 'Woah, Nellie! Please submit a valid email',
          variant: 'danger',
        })
      }
    } catch (err) {
      console.error('CLIENT ERROR: failed to add to mail list', err)
    }
  };

  const handleMailingInfoChange = (e: any) => {
    const { name, value } = e.target;
    setMailingListInfo({
      ...mailingListInfo,
      [name]: value
    })
  }

  return (
    <div id='login'>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignContent: 'center',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: '#fffcf8',
          textAlign: 'center',
          paddingBottom: '2rem',
        }}
      >
        <h1>OPEN BETA</h1>
        <img
          id='login-img'
          src='img/jesterPin.png'
          alt='jester pin logo'
          width='100%'
          height='auto'
        />

        <p>
          <b>Your one-stop-shop for managing the chaos of Mardi Gras.</b>
        </p>
        <p style={{lineHeight:"normal"}}>
          Share gossip, costumes, throws, drop pins with hot commodities, create
          events with your friends, checkout local music, and look up parade
          schedules!
        </p>
        <p>
          Take the{' '}
          <a href='https://docs.google.com/forms/d/e/1FAIpQLSfSGLNva3elpadLqpXw1WuD9b4H39lBuX6YMiKT5_o2DNQ7Gg/viewform'>
            Survey
          </a>{' '}
          and let us know what you think!
        </p>
        <p>
          Any additional feedback? Drop a line at{' '}
          <a href='mailto:pardigrasinfo@gmail.com'>PardiGrasInfo@gmail.com</a>
        </p>
        {/* <p>Like what you see?  Support us on <a href="https://www.kickstarter.com">Kickstarter</a></p> */}
        <br />
        {/* <Button className="btn-login" style={{backgroundColor: "#e7abff" }} onClick={() => loginWithRedirect()}>Log In</Button> */}
        <Form>
          <Form.Control onChange={handleMailingInfoChange} type="text" name="firstName" placeholder='First Name'/>
          <Form.Control onChange={handleMailingInfoChange} type="text" name="lastName" placeholder='Last Name'/>
          <Form.Control onChange={handleMailingInfoChange} type="email" name="email" placeholder='Email'/>
          {formEmailAlert.isDisplayed && <Alert variant={formEmailAlert.variant}>{formEmailAlert.text}</Alert>}
          <Button variant='success' onClick={addToMailingList}>
            Submit
          </Button>
        </Form>
        <Button
          className='btn-login'
          style={{ backgroundColor: '#e7abff' }}
          onClick={() => handleNavigation('/homepage')}
        >
          Enter Here!
        </Button>
      </div>
    </div>
  );
};

export default LoginButton;
