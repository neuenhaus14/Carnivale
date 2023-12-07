import React, { ReactPropTypes, useEffect, useState }from 'react';
import { useSearchParams  } from "react-router-dom";
import axios from 'axios';

const UserPage = ({ coolThing }: UserPageProps ) => {

  const [searchParams] = useSearchParams();
  const [ userId ] = useState(Number(searchParams.get('userid')) || 1);
  const [ friends, setFriends ] = useState([{firstName: 'Gramma'}]); // array of user id's
  const [ friendRequestsMade, setFriendRequestsMade ] = useState([]);
  const [ friendRequestsReceived, setFriendRequestsReceived ] = useState([])
  const [ eventsParticipating, setEventsParticipating ] = useState([{name: 'event1'}]);
  const [ eventsInvited, setEventsInvited ] = useState([{name: 'event2'}]);
  

  async function getFriends() {
    try{
      const friends = await axios.get(`/api/friends/getFriends/${userId}`)
      // console.log('here', friends.data);
      setFriends(friends.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user friends', err)
    }
  }

  async function getEventsParticipating() {
    try{
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
    try{
      const friendRequestsData = await axios.get(`api/events/getFriendRequests/:id`);
      const { requestsMade, requestsReceived } = friendRequestsData.data;
      setFriendRequestsReceived(requestsReceived);
      setFriendRequestsMade(requestsMade);
    } catch (err) {
      console.error("CLIENT ERROR: could not GET friend requests ", err)
    }

  }

  useEffect(() => {
    console.log('chyeah', searchParams);
    getFriends();
    getEventsParticipating();
    getEventsInvited();
  }, [])


    const friendsListItems = friends.map((friend: any, index: number) => {
      return <li key={index}>{friend.firstName} {friend.lastName}</li>
    })

    const requestsMadeListItems = friendRequestsMade.map((request) => {
      return <li>{request.</li>
    })

    const eventsParticipatingListItems = eventsParticipating.map((event: any, index: number) => {
      return <li key={index}>{event.name} {event.description}</li>
    })

    const eventsInvitedListItems = eventsInvited.map((event: any, index: number) => {
      return <li key={index}>{event.name} {event.description}</li>
    })

  console.log('eP', eventsParticipating, 'eI', eventsInvited)
  return (
    <div>
      <h1>UserPage!!!</h1>

      <p> { coolThing } </p>
      <p> { userId } </p>

      <h3> MON KREWE </h3>
      <ul>{ friendsListItems }</ul>

      <h3> KREWE REQUESTS MADE </h3>


      <h3> KREWE REQUESTS RECEIVED </h3>


      <h3> EVENTS ATTENDING</h3>
      <ul>{ eventsParticipatingListItems }</ul>

      <h3>EVENTS INVITED</h3>
      <ul>{ eventsInvitedListItems }</ul>

    </div>
  )
};

interface UserPageProps {
  coolThing: string
}

export default UserPage;