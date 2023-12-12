import React, { ReactPropTypes, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import EventBasicModal from './EventBasicModal';

const UserPage = ({ coolThing }: UserPageProps) => {

  const [searchParams] = useSearchParams();
  const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [friends, setFriends] = useState([]); // array of user id's
  const [friendRequestsMade, setFriendRequestsMade] = useState([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState([])
  const [eventsParticipating, setEventsParticipating] = useState([{ name: 'event1' }]);
  const [eventsInvited, setEventsInvited] = useState([{ name: 'event2' }]);
  const [phoneForFriendRequest, setPhoneForFriendRequest] = useState('');

  const [selectedEvent, setSelectedEvent] = useState({})
  const [isUserAttending, setIsUserAttending] = useState(false) // this gets passed to basic modal to expose invite functionality
  const [showBasicModal, setShowBasicModal] = useState(false);

  async function getFriends() {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`)
      // console.log('here', friends.data);
      setFriends(friends.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user friends', err)
    }
  }

  async function getEventsParticipating() {
    try {
      const eventsParticipating = await axios.get(`api/events/getEventsParticipating/${userId}`)
      setEventsParticipating(eventsParticipating.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user\'s participating events', err)
    }
  }

  async function getEventsInvited() {
    try {
      const eventsInvited = await axios.get(`api/events/getEventsInvited/${userId}`);
      setEventsInvited(eventsInvited.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user\'s event invitations', err)
    }
  }

  async function getFriendRequests() {
    try {
      const friendRequestsData = await axios.get(`api/friends/getFriendRequests/${userId}`);
      const { requestsMadeUsers, requestsReceivedUsers } = friendRequestsData.data;
      console.log(requestsMadeUsers, requestsReceivedUsers)
      setFriendRequestsReceived(requestsReceivedUsers);
      setFriendRequestsMade(requestsMadeUsers);
    } catch (err) {
      console.error("CLIENT ERROR: could not GET friend requests ", err)
    }

  }

  useEffect(() => {
    getFriends();
    getEventsParticipating();
    getEventsInvited();
    getFriendRequests();
  }, [])

  // ALL RENDERED DATA ARE IN LIST ITEMS
  let userFriendsItems = null;
  if (friends.length > 0) {
    userFriendsItems = friends.map((friend: any, index: number) => {
      return <li key={index}>{friend.firstName} {friend.lastName} <button onClick={() => unfriend(friend.id)}>Remove from Krewe</button></li>
    })
  }

  let requestsMadeItems = null;
  if (friendRequestsMade.length > 0) {
    requestsMadeItems = friendRequestsMade.map((requestee, index: number) => {
      return <li key={index}>{requestee.firstName} <button onClick={() => cancelFriendRequest(requestee.id)}>Cancel invite</button></li>
    })
  }

  let requestsReceivedItems = null;
  if (friendRequestsReceived.length > 0) {
    requestsReceivedItems = friendRequestsReceived.map((friend, index) => {
      return <li key={index}>{friend.firstName} <button onClick={() => answerFriendRequest(friend.id, true)}>Yeah!</button><button onClick={() => answerFriendRequest(friend.id, false)}>Nah...</button></li>
    })
  }

  let eventsParticipatingItems = null;
  if (eventsParticipating.length > 0) {
    eventsParticipatingItems = eventsParticipating.map((event: any, index: number) => {
      return <li key={index} onClick={() => { setIsUserAttending(true); setShowBasicModal(true); setSelectedEvent(event) }}>{event.name} {event.description}</li>
    })
  }

  let eventsInvitedItems = null;
  if (eventsInvited.length > 0) {
    eventsInvitedItems = eventsInvited.map((event: any, index: number) => {
      return <li key={index}>{event.name} {event.description} 
      <button onClick={() => answerEventInvitation(event.id, true)}>Yeah!</button><button onClick={() => answerEventInvitation(event.id, false)}>Nah...</button></li>
    })
  }

  // FUNCTIONS FOR DATA ITEMS

  // FRIENDS
  async function requestFriend() {
    const friendRequestResponse = await axios.post('/api/friends/requestFriend', {
      friendRequest: {
        requester_userId: userId,
        recipient_phoneNumber: phoneForFriendRequest,
      }
    })
    console.log('friedRequestRecord', friendRequestResponse);
    setPhoneForFriendRequest('');
    getFriendRequests();
  }

  async function cancelFriendRequest(recipient_userId: number) {
    const deleteResponse = await axios.delete(`/api/friends/cancelFriendRequest/${userId}-${recipient_userId}`)
    console.log(deleteResponse);
    getFriendRequests();
  }

  async function answerFriendRequest(requester_userId: number, isConfirmed: boolean) {
    const updatedRelationship = await axios.patch('/api/friends/answerFriendRequest', {
      answer: {
        requester_userId,
        recipient_userId: userId,
        isConfirmed
      }
    })
    console.log('updated Relationship', updatedRelationship);
    getFriends();
    getFriendRequests();
  }

  async function unfriend(friendId: number) {
    const deleteResponse = await axios.delete(`/api/friends/unfriend/${userId}-${friendId}`);
    console.log(deleteResponse)
    getFriends();
  }



  // MOVE THIS TO EVENT MODAL
  async function answerEventInvitation(eventId: number, isGoing: boolean) {
    const eventInviteResponse = await axios.post('/api/events/answerEventInvite', {
      answer: {
        eventId,
        invitee_userId: userId,
        isGoing
      }
    })
    console.log('eventInviteResponse', eventInviteResponse);
    getEventsInvited();
    getEventsParticipating();
  }



  function handlePhoneInput(e: any) {
    setPhoneForFriendRequest(e.target.value);
  }


  console.log('eP', eventsParticipating, 'eI', eventsInvited)
  return (
    <div>
      <h1>UserPage</h1>
      <EventBasicModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setShowAttendingModal={setShowBasicModal}
        showBasicModal={showBasicModal}
        friends={friends}
        userId={userId}
        isUserAttending={isUserAttending}
      />
      <h5> Mon Krewe </h5>
      {friends.length > 0 ? <ul>{userFriendsItems}</ul> : 'Assemble your krewe below'}

      <input placeholder='Search people by phone' value={phoneForFriendRequest} onChange={handlePhoneInput}></input>
      <button onClick={requestFriend}>Invite to Krewe</button>


      {
        // conditional checks for outgoing requests
        friendRequestsMade.length > 0 &&  
        <>
          <h5> Krewe Invites Made </h5>
          <ul>{requestsMadeItems}</ul>
        </>
      }

      {
        // conditional checks for incoming requests
        friendRequestsReceived.length > 0 &&
        <>
          <h5> Respond to These Invites </h5>
          <ul>{requestsReceivedItems}</ul>
        </>
      }


      {
        // conditional checks for events you've attending
        eventsParticipating.length > 0 &&
        <>
          <h3> EVENTS ATTENDING</h3>
          <ul>{eventsParticipatingItems}</ul>
        </>
      }


      {
      // conditional checks for events you've invited to
      eventsInvited.length > 0 &&
        <>
          <h3>EVENTS INVITED</h3>
          <ul>{eventsInvitedItems}</ul>
        </>
      }
    </div>
  )
};

interface UserPageProps {
  coolThing: string
}

export default UserPage;