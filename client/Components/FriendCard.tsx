import React, {useContext} from 'react';
import { Card, Button } from 'react-bootstrap';
import { User } from '../types';
import { FaUserAltSlash } from '@react-icons/all-files/Fa/FaUserAltSlash';
import { UserContext } from './Context';
import axios from 'axios';


interface FriendCardProps {
  friend: User;
  setConfirmActionBundle: any;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, setConfirmActionBundle }) => {

  const {user} = useContext(UserContext);

    // delete record in User_friends table
    const revokeFriendRequest = async () => {
      const revokeFriendRequestResponse = await axios.delete(
        `/api/friends/revokeFriendship/${user.id}&${friend.id}`
      );
    };

  return (
    <Card className='friend-card'>
      <Card.Body className='d-flex flex-row justify-content-between align-items-center'>
        <Card.Text className='mb-0'>
          {friend.firstName} {friend.lastName}
        </Card.Text>
        <Button className='icon-btn' variant='danger' onClick={async () => {
                await setConfirmActionBundle.setConfirmActionFunction(() => () => revokeFriendRequest());
                await setConfirmActionBundle.setConfirmActionText(
                  `revoke friendship with ${friend.firstName}.`
                );
                await setConfirmActionBundle.setShowConfirmActionModal(true);
              }}>
          <FaUserAltSlash />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FriendCard;
