import React, { useContext } from 'react';
import { UserContext } from './Context';
import { Button, Card } from 'react-bootstrap';
import { FriendRequest } from '../types';
import { FaThumbsUp } from '@react-icons/all-files/fa/FaThumbsUp';
import { FaUserAltSlash } from '@react-icons/all-files/Fa/FaUserAltSlash';
import { FaThumbsDown } from '@react-icons/all-files/fa/FaThumbsDown';


interface FriendRequestCardProps {
  friendRequest: FriendRequest;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  friendRequest,
}) => {
  const { user } = useContext(UserContext);

  const revokeFriendRequest = () => {};

  const answerFriendRequest = (answer: 'approve' | 'deny') => {};

  return (
    <Card className='friend-request-card'>
      {friendRequest.requesterId === user.id ? (
        // Waiting for response
        <Card.Body className='d-flex align-items-center justify-content-between'>
          <Card.Text className='post-card-text' as='div'>
            Waiting on {friendRequest.recipient.firstName}{' '}
            {friendRequest.recipient.lastName}
          </Card.Text>

            <Button className='icon-btn' variant='danger'>
              <FaUserAltSlash />
            </Button>

        </Card.Body>
      ) : (
        // Need to response
        <Card.Body className='d-flex align-items-center justify-content-between'>
          <Card.Text className='post-card-text' as='div'>
            Answer {friendRequest.requester.firstName}{' '}
            {friendRequest.requester.lastName}{' '}
          </Card.Text>
          <Button className='icon-btn' variant='success'><FaThumbsUp /></Button>
          <Button className='icon-btn' variant='danger'>
            <FaThumbsDown/>
          </Button>
        </Card.Body>
      )}
    </Card>
  );
};

export default FriendRequestCard;
