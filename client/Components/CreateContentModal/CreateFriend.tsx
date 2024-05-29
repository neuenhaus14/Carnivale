import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { UserContext, RunModeContext } from '../Context';

interface CreateFriendProps {}

const CreateFriend: React.FC<CreateFriendProps> = ({}) => {
  // TODO: Add alert or toast feedback for creating friend

  const { user } = useContext(UserContext);

  const [email, setEmail] = useState<string>('');

  const [alert, setAlert] = useState({
    isDisplayed: false,
    text: '',
    variant: 'success',
  });

  const isDemoMode = useContext(RunModeContext) === 'demo';

  const handleEmail = (e: any) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleSubmit = async () => {
    try {
      const friendRequestResponse = await axios.post(
        '/api/friends/createFriendRequest',
        {
          requesterId: user.id,
          email,
        }
      );
      // console.log('fRR', friendRequestResponse)
      if (friendRequestResponse.status === 404) {
        setAlert({
          isDisplayed: true,
          text: "Sorry, there's no user with that email, try again.",
          variant: 'danger',
        });
      } else if (friendRequestResponse.status === 500) {
        setAlert({
          isDisplayed: true,
          text: 'Sorry, something went wrong. Try again.',
          variant: 'danger',
        });
      } else if (friendRequestResponse.status === 200) {
        setAlert({
          isDisplayed: true,
          text: 'Request made!',
          variant: 'success',
        });
      }
    } catch (e) {
      console.error('CLIENT ERROR: failed to create friend request');
    } finally {
      setTimeout(() => {
        setAlert({
          isDisplayed: false,
          text: '',
          variant: 'success',
        });
      }, 5000);
    }
  };

  // console.log('email', email)
  return (
    <div>
      <Form className='d-flex flex-column justify-content-center'>
        <Form.Group>
          <Form.Control
            placeholder="Search by friend's e-mail"
            type='text'
            onChange={handleEmail}
          />
        </Form.Group>
        <Button className='mx-auto mt-2' onClick={handleSubmit}>
          Add Friend
        </Button>
        {alert.isDisplayed && (
          <Alert variant={alert.variant}>{alert.text}</Alert>
        )}
      </Form>
    </div>
  );
};

export default CreateFriend;
