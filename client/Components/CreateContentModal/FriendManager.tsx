import React, { useContext, useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { UserContext, RunModeContext } from '../Context';
import { User, FriendRequest } from '../../types';
import FriendCard from '../Cards/FriendCard';
import FriendRequestCard from '../Cards/FriendRequestCard';
import CreateFriend from './CreateFriend';
import axios from 'axios';

interface FriendManagerProps {
  setConfirmActionBundle: any; // sending to friend card
}

const FriendManager: React.FC<FriendManagerProps> = ({
  setConfirmActionBundle,
}) => {
  const { user, friends, votes } = useContext(UserContext);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // TODO: put friend requests in userContext so we don't have to go fetch friend request info
  const getFriendRequests = async () => {
    if (user.id) {
      const friendRequestResponse = await axios.get(
        `/api/friends/getRequests/${user.id}`
      );
      setFriendRequests(friendRequestResponse.data);
    }
  };

  useEffect(() => {
    getFriendRequests();
  }, [user]);

  return (
    <Accordion defaultActiveKey='1' className='m-2'>
      <Accordion.Item eventKey='0'>
        <Accordion.Header>Friends</Accordion.Header>
        <Accordion.Body>
          {friends.map((friend: User, index) => {
            return (
              <FriendCard
                key={`${index}-${friend.id}`}
                friend={friend}
                setConfirmActionBundle={setConfirmActionBundle}
              />
            );
          })}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='1'>
        <Accordion.Header>Pending Requests</Accordion.Header>
        <Accordion.Body>
          {/* FRIEND REQUESTS */}
          {friendRequests.map((friendRequest: FriendRequest, index: number) => {
            return (
              <FriendRequestCard
                key={`${index}-${friendRequest.id}`}
                friendRequest={friendRequest}
                setConfirmActionBundle={setConfirmActionBundle}
              />
            );
          })}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey='2'>
        <Accordion.Header>Add a Friend</Accordion.Header>
        <Accordion.Body>
          <CreateFriend />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default FriendManager;
