import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { User } from '../../types';
import { FaUserAltSlash } from '@react-icons/all-files/Fa/FaUserAltSlash';
import { UserContext, ContentFunctionsContext } from '../Context';
import axios from 'axios';

interface FriendCardProps {
  friend: User;
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
}) => {
  const { user } = useContext(UserContext);
  const {setConfirmActionModalBundle} = useContext(ContentFunctionsContext);
  // delete record in User_friends table
  const unfriend = async () => {
    try{
    const unfriendResponse = await axios.delete(
      `/api/friends/revokeFriendship/${user.id}&${friend.id}`
    );} catch (e) {
      console.error('CLIENT ERROR: failed to unfriend', e);
    }
  };

  return (
    <Card className='friend-card'>
      <Card.Body className='d-flex flex-row justify-content-between align-items-center'>
        <Card.Text className='mb-0'>
          {friend.firstName} {friend.lastName}
        </Card.Text>
        <Button
          className='icon-btn'
          variant='danger'
          onClick={async () => {
            await setConfirmActionModalBundle.setConfirmActionFunction(
              () => () => unfriend()
            );
            await setConfirmActionModalBundle.setConfirmActionText(
              `revoke friendship with ${friend.firstName}.`
            );
            await setConfirmActionModalBundle.setShowConfirmActionModal(true);
          }}
        >
          <FaUserAltSlash />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FriendCard;
