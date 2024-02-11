import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Form, Alert, Row, Col, Container } from 'react-bootstrap';
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
    isDisplayed: false,
    text: '',
    variant: '',
  });

  const validateEmail = function (email: string) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  // add mailing list info from client to Atlas db
  const addToMailingList = async () => {
    try {
      if (validateEmail(mailingListInfo.email)) {
        // console.log('email valid')
        await axios.post('/api/mail/addToMailList', mailingListInfo);
        setFormEmailAlert({
          isDisplayed: true,
          text: "Thanks! You're on the list.",
          variant: 'success',
        });
      } else {
        console.log('email invalid');
        setFormEmailAlert({
          isDisplayed: true,
          text: 'Please submit a valid email.',
          variant: 'danger',
        });
        setMailingListInfo({
          ...mailingListInfo,
          email: ''
        })
      }
    } catch (err) {
      console.error('CLIENT ERROR: failed to add to mail list', err);
    }
  };

  const handleMailingInfoChange = (e: any) => {
    const { name, value } = e.target;
    setMailingListInfo({
      ...mailingListInfo,
      [name]: value,
    });
  };

  return (
    <div id='login'>
      <Container
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
        }}
      >
        <Row>
          <Col></Col>
          <Col xs={10} className='d-flex flex-row justify-content-around'>
            <div className='d-flex flex-column mx-auto align-self-center'>
              <h1 className='mb-0'>Pardi Gras</h1>
              <h5 className='text-center mt-0' style={{fontFamily: '"Permanent Marker", serif'}}>OPEN BETA</h5>
            </div>
            <img
              id='login-img'
              src='img/jesterPin-1.png'
              alt='jester pin logo'
            />
          </Col>
          <Col></Col>
        </Row>
        <hr></hr>
        <p className='text-center lh-sm'>
          <b>Your one-stop-shop for managing the chaos of Mardi Gras.</b>
        </p>
        <ul className='text-left'>
          <li className='login-text'>Share gossip, costumes & throws</li>
          <li className='login-text'>Drop pins to map hot commodities</li>
          <li className='login-text'>
            Find live music, parade info & make plans with your friends
          </li>
        </ul>

        <p className='login-text text-left lh-sm'>
          Wanna get involved?{' '}
          <a href='https://docs.google.com/forms/d/e/1FAIpQLSfSGLNva3elpadLqpXw1WuD9b4H39lBuX6YMiKT5_o2DNQ7Gg/viewform'>
            Take our survey
          </a>{' '}
          or <a href='mailto:pardigrasinfo@gmail.com'>shoot us an email</a> - we love feedback! Or subscribe to the mailing list below:
        </p>
        <h5 className='text-center mt-2' style={{fontFamily: '"Permanent Marker", serif'}}>
          Subscribe to the mailing list:
        </h5>

        {/* <p>Like what you see?  Support us on <a href="https://www.kickstarter.com">Kickstarter</a></p> */}
        {/* <Button className="btn-login" style={{backgroundColor: "#e7abff" }} onClick={() => loginWithRedirect()}>Log In</Button> */}
        <Form>
          <div className='d-flex flex-row mail-list-form-items'>
            <Form.Control
              onChange={handleMailingInfoChange}
              type='text'
              name='firstName'
              placeholder='First Name'
              value={mailingListInfo.firstName}
            />
            <Form.Control
              onChange={handleMailingInfoChange}
              type='text'
              name='lastName'
              placeholder='Last Name'
              value={mailingListInfo.lastName}
            />
          </div>
          <div className='d-flex flex-row mail-list-form-items'>
            <Form.Control
              onChange={handleMailingInfoChange}
              type='email'
              name='email'
              placeholder='Email'
              value={mailingListInfo.email}
            />
            <Button variant='success' onClick={addToMailingList}>
              Subscribe
            </Button>
          </div>
          <div className='mail-list-form-items'>
            {formEmailAlert.isDisplayed && (
              <Alert variant={formEmailAlert.variant}>
                {formEmailAlert.text}
              </Alert>
            )}
          </div>
        </Form>
        <Button
          className='mt-4 mb-3'
          variant='secondary'
          onClick={() => handleNavigation('/homepage')}
        >
          Enter Pardi Gras
        </Button>
      </Container>
    </div>
  );
};

export default LoginButton;
