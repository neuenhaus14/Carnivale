import React, { useContext } from 'react';
import { UserContext, ContentFunctionsContext } from '../Context';
import { Button, Card } from 'react-bootstrap';
import { FriendRequest } from '../../types';
import { FaThumbsUp } from '@react-icons/all-files/fa/FaThumbsUp';
import { FaUserAltSlash } from '@react-icons/all-files/Fa/FaUserAltSlash';
import { FaThumbsDown } from '@react-icons/all-files/fa/FaThumbsDown';
import axios from 'axios';

interface FriendRequestCardProps {
  friendRequest: FriendRequest;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  friendRequest,
}) => {
  const { user } = useContext(UserContext);
  const { setConfirmActionModalBundle } = useContext(ContentFunctionsContext);

  // delete record in User_friends table
  const revokeFriendRequest = async () => {
    try {
      const revokeFriendRequestResponse = await axios.delete(
        `/api/friends/revokeFriendship/${friendRequest.recipientId}&${friendRequest.requesterId}`
      );
    } catch (e) {
      console.error('CLIENT ERROR: failed to revoke friend request', e);
    }
  };

  const respondToFriendRequest = async (answer: 'accepted' | 'denied') => {
    try {
      const respondToFriendRequestResponse = await axios.patch(
        '/api/friends/respondToFriendRequest',
        {
          friendRequestId: friendRequest.id,
          answer,
        }
      );
    } catch (e) {
      console.error('CLIENT ERROR: failed to respond to friend request', e);
    }
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
              await setConfirmActionModalBundle.setConfirmActionFunction(
                () => () => revokeFriendRequest()
              );
              await setConfirmActionModalBundle.setConfirmActionText(
                `revoke friend invitation to ${friendRequest.recipient.firstName}.`
              );
              await setConfirmActionModalBundle.setShowConfirmActionModal(true);
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
          <div className='d-flex'>
            <Button
              className='icon-btn mx-2'
              variant='success'
              onClick={() => respondToFriendRequest('accepted')}
            >
              <FaThumbsUp />
            </Button>
            <Button
              className='icon-btn'
              variant='danger'
              onClick={async () => {
                await setConfirmActionModalBundle.setConfirmActionFunction(
                  () => () => respondToFriendRequest('denied')
                );
                await setConfirmActionModalBundle.setConfirmActionText(
                  `deny friend invite from ${friendRequest.requester.firstName}.`
                );
                await setConfirmActionModalBundle.setShowConfirmActionModal(
                  true
                );
              }}
            >
              <FaThumbsDown />
            </Button>
          </div>
        </Card.Body>
      )}
    </Card>
  );
};

export default FriendRequestCard;
