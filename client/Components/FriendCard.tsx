import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { FriendRequest } from '../types';

interface FriendCardProps {
  friendRequest: FriendRequest;
}

const FriendCard : React.FC<FriendCardProps> = ({friendRequest}) => {

  return (
    <Card className='friend-card'>
      <Card.Body>
        <Card.Text className='post-card-text text-center' as='div'>
<b>{friendRequest.requester.firstName} {friendRequest.requester.lastName}</b> wants to add you as a friend.
        </Card.Text>
<div className='d-flex  justify-content-center my-2'>
<Button className='mx-2'>
    Confirm
</Button>
<Button className='mx-2' variant='danger'>
    Deny
</Button>
</div>
      </Card.Body>
    </Card>
  )
}

export default FriendCard;
