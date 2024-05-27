import React, { useContext } from 'react';
import { UserContext } from './Context';
import { Button, Card } from 'react-bootstrap';
import { FriendRequest } from '../types';
import { FaThumbsUp } from '@react-icons/all-files/fa/FaThumbsUp';
import { FaUserAltSlash } from '@react-icons/all-files/Fa/FaUserAltSlash';
import { FaThumbsDown } from '@react-icons/all-files/fa/FaThumbsDown';
import axios from 'axios';

interface FriendRequestCardProps {
  friendRequest: FriendRequest;
  setConfirmActionBundle: any;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  friendRequest,
  setConfirmActionBundle,
}) => {
  const { user } = useContext(UserContext);

  // delete record in User_friends table
  const revokeFriendRequest = async () => {
    const revokeFriendRequestResponse = await axios.delete(
      `/api/friends/revokeFriendship/${friendRequest.recipientId}&${friendRequest.requesterId}`
    );
  };

  const respondToFriendRequest = async (answer: 'accepted' | 'denied') => {
    const respondToFriendRequestResponse = await axios.patch(
      '/api/friends/respondToFriendRequest',
      {
        friendRequestId: friendRequest.id,
        answer,
      }
    );
  };

  return (
    <Card className='friend-request-card'>
      {friendRequest.requesterId === user.id ? (
        // Waiting for response
        <Card.Body className='d-flex align-items-center justify-content-between'>
          <Card.Text className='post-card-text' as='div'>
            Waiting on {friendRequest.recipient.firstName}{' '}
            {friendRequest.recipient.lastName}
          </Card.Text>

          <Button
            className='icon-btn'
            variant='danger'
            onClick={async () => {
              await setConfirmActionBundle.setConfirmActionFunction(
                () => () => revokeFriendRequest()
              );
              await setConfirmActionBundle.setConfirmActionText(
                `revoke friend invitation to ${friendRequest.recipient.firstName}.`
              );
              await setConfirmActionBundle.setShowConfirmActionModal(true);
            }}
          >
            <FaUserAltSlash />
          </Button>
        </Card.Body>
      ) : (
        // Need to respond
        <Card.Body className='d-flex align-items-center justify-content-between'>
          <Card.Text className='post-card-text' as='div'>
            Answer {friendRequest.requester.firstName}{' '}
            {friendRequest.requester.lastName}{' '}
          </Card.Text>
          <Button className='icon-btn' variant='success' onClick={()=>respondToFriendRequest('accepted')}>
            <FaThumbsUp />
          </Button>
          <Button className='icon-btn' variant='danger' onClick={async () => {
              await setConfirmActionBundle.setConfirmActionFunction(
                () => () => respondToFriendRequest('denied')
              );
              await setConfirmActionBundle.setConfirmActionText(
                `deny friend invite from ${friendRequest.recipient.firstName}.`
              );
              await setConfirmActionBundle.setShowConfirmActionModal(true);
            }}>
            <FaThumbsDown />
          </Button>
        </Card.Body>
      )}
    </Card>
  );
};

export default FriendRequestCard;
