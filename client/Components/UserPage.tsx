import React, { ReactPropTypes, useEffect, useState } from 'react';
import { useSearchParams, Link } from "react-router-dom";
import axios from 'axios';
import EventBasicModal from './EventBasicModal';
import EventCreateModal from './EventCreateModal';
import { Button } from 'react-bootstrap';

//                              add userId as prop to get it from App
const UserPage: React.FC<UserPageProps> = ({ getLocation, lng, lat, }) => {


  const [searchParams] = useSearchParams();
  const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [friends, setFriends] = useState([]); // array of user id's
  const [friendRequestsMade, setFriendRequestsMade] = useState([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
  const [eventsParticipating, setEventsParticipating] = useState([{ name: 'event1' }]);
  const [eventsInvited, setEventsInvited] = useState([{ name: 'event2' }]);
  const [eventsOwned, setEventsOwned] = useState([{ name: 'event3' }]);

  const [phoneForFriendRequest, setPhoneForFriendRequest] = useState('');
  const [nameForFriendRequest, setNameForFriendRequest] = useState('');

  const [selectedEvent, setSelectedEvent] = useState({ latitude: 0, longitude: 0, startTime: null, endTime: null }) // default to make modals happy
  const [isUserAttending, setIsUserAttending] = useState(false) // this gets passed to basic modal to expose invite functionality
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isNewEvent, setIsNewEvent] = useState(false);

  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`)
      // console.log('here', friends.data);
      setFriends(friends.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user friends', err)
    }
  }

  const getEventsOwned = async () => {
    try {
      const eventsOwned = await axios.get(`api/events/getEventsOwned/${userId}`)
      setEventsOwned(eventsOwned.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to get events owned', err)
    }
  }

  const getEventsParticipating = async () => {
    try {
      const eventsParticipating = await axios.get(`api/events/getEventsParticipating/${userId}`)
      setEventsParticipating(eventsParticipating.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user\'s participating events', err)
    }
  }

  const getEventsInvited = async () => {
    try {
      const eventsInvited = await axios.get(`api/events/getEventsInvited/${userId}`);
      setEventsInvited(eventsInvited.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user\'s event invitations', err)
    }
  }

  const getFriendRequests = async () => {
    try {
      const friendRequestsData = await axios.get(`api/friends/getFriendRequests/${userId}`);
      const { requestsMadeUsers, requestsReceivedUsers } = friendRequestsData.data;
      // console.log(requestsMadeUsers, requestsReceivedUsers)
      setFriendRequestsReceived(requestsReceivedUsers);
      setFriendRequestsMade(requestsMadeUsers);
    } catch (err) {
      console.error("CLIENT ERROR: could not GET friend requests ", err)
    }

  }


  useEffect(() => {
    // getLocation() DON'T NEED THIS, IT'S GETTING PASSED IN

    // for updating events on userpage when
    // responding to invites or inviting other users

    // TODO: I think isNewEvent gets flipped
    // to false from the eventCreateModal,
    // so isNewEvent should realistically
    // always be false. This uE only
    // runs on the first page load, right?
    if (isNewEvent === false) {
      getFriends();
      getEventsOwned();
      getEventsParticipating();
      getEventsInvited();
      getFriendRequests();
    }
  }, [userId, isNewEvent])

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

  let eventsOwnedItems = null;
  if (eventsOwned.length > 0) {
    eventsOwnedItems = eventsOwned.map((event: any, index: number) => {
      return <li
        key={index}
        onClick={() => {
          setIsNewEvent(false);
          setIsUserAttending(true);
          setShowCreateModal(true);
          setSelectedEvent(event);
        }}>
        {event.name} {event.description}
      </li>
    })
  }

  let eventsParticipatingItems = null;
  if (eventsParticipating.length > 0) {
    eventsParticipatingItems = eventsParticipating.map((event: any, index: number) => {
      return <li
        key={index}
        onClick={() => {
          setIsNewEvent(false);
          setIsUserAttending(true);
          setShowBasicModal(true);
          setSelectedEvent(event)
        }}>
        {event.name} {event.description}
      </li>
    })
  }

  let eventsInvitedItems = null;
  if (eventsInvited.length > 0) {
    eventsInvitedItems = eventsInvited.map((event: any, index: number) => {
      return <li
        key={index}
        onClick={() => {
          setIsNewEvent(false);
          setIsUserAttending(false);
          setShowBasicModal(true);
          setSelectedEvent(event)
        }}>
        {event.name} {event.description}
      </li>
    })
  }

  // FUNCTIONS FOR DATA ITEMS

  // FRIENDS
  async function requestFriend() {
    try {
      // checking for phoneNumber

      const friendRequestResponse = await axios.post('/api/friends/requestFriend', {
        friendRequest: {
          requester_userId: userId,
          recipient_phoneNumber: phoneForFriendRequest,
          recipient_name: nameForFriendRequest,
        }
      }
      )

      setPhoneForFriendRequest('');
      setNameForFriendRequest('');
      getFriendRequests();
    } catch (err) {
      console.error('CLIENT ERROR: failed to POST friend request', err);
    }
  }

  async function cancelFriendRequest(recipient_userId: number) {
    const deleteResponse = await axios.delete(`/api/friends/cancelFriendRequest/${userId}-${recipient_userId}`)
    //console.log(deleteResponse);
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
    //console.log('updated Relationship', updatedRelationship);
    getFriends();
    getFriendRequests();
  }

  async function unfriend(friendId: number) {
    const deleteResponse = await axios.delete(`/api/friends/unfriend/${userId}-${friendId}`);
    //console.log(deleteResponse)
    getFriends();
  }

  function handlePhoneInput(e: any) {
    setPhoneForFriendRequest(e.target.value);
  }

  function handleFriendNameInput(e: any) {
    setNameForFriendRequest(e.target.value);
  }

  // console.log('inside userpage. isNewEvent', isNewEvent)
  return (
    <div>
      <h1>UserPage {lng} {lat}</h1>
      <EventBasicModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setShowBasicModal={setShowBasicModal}
        showBasicModal={showBasicModal}
        friends={friends}
        userId={userId}
        isUserAttending={isUserAttending}
        setIsUserAttending={setIsUserAttending}
        getEventsInvited={getEventsInvited}
        getEventsParticipating={getEventsParticipating}
      />

      <EventCreateModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setShowCreateModal={setShowCreateModal}
        showCreateModal={showCreateModal}
        friends={friends}
        userId={userId}
        // isUserAttending={isUserAttending}
        // setIsUserAttending={setIsUserAttending}
        // getEventsInvited={getEventsInvited}
        // getEventsParticipating={getEventsParticipating}
        isNewEvent={isNewEvent}
        setIsNewEvent={setIsNewEvent}
        lat={lat}
        lng={lng}
        //getLocation={getLocation}
        eventType = {'user'}
      />

      <h5> Mon Krewe </h5>
      {friends.length > 0 ? <ul>{userFriendsItems}</ul> : 'Assemble your krewe below'}

      <input
        placeholder='Search people by phone'
        value={phoneForFriendRequest}
        onChange={handlePhoneInput}></input>
      <input
        placeholder='Or by first & last name'
        value={nameForFriendRequest}
        onChange={handleFriendNameInput}></input>
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
        // conditional check for events you own
        eventsOwned.length > 0 &&
        <>
          <h3> EVENTS OWNED </h3>
          <ul>{eventsOwnedItems}</ul>
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

      <Button
        variant='secondary'
        onClick={async () => {
          await setIsNewEvent(true);
          await setIsUserAttending(true);
          await setShowCreateModal(true);
        }}
      >
        Create New Event
      </Button>

      {/* Link below is styled like a bootstrap button */}
      <Link
        className="btn btn-primary"
        role="button"
        to="/eventpage"
      >
        Gigs
      </Link>
      <Link
        className="btn btn-primary"
        role="button"
        to="/parades"
      >
        Parades
      </Link>

    </div>
  )
};

interface UserPageProps {
  getLocation: any,
  lng: number,
  lat: number,
  userId: number,
}

export default UserPage;