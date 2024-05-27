import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { User } from '../types';
import { FaUserAltSlash } from '@react-icons/all-files/Fa/FaUserAltSlash';
interface FriendCardProps {
  friend: User;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  return (
    <Card className='friend-card'>
      <Card.Body className='d-flex flex-row justify-content-between align-items-center'>
        <Card.Text className='mb-0'>
          {friend.firstName} {friend.lastName}
        </Card.Text>
        <Button className='icon-btn' variant='danger'>
          <FaUserAltSlash />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FriendCard;
