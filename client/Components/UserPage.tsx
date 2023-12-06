import React, { ReactPropTypes, useEffect, useState }from 'react';
import { useSearchParams  } from "react-router-dom";
import axios from 'axios';

const UserPage = ({ coolThing }: UserPageProps ) => {

  const [searchParams] = useSearchParams();
  const [ userId ] = useState(Number(searchParams.get('userid')) || null);
  const [ friends, setFriends ] = useState([{firstName: 'Gramma'}]) // array of user id's

  async function getUserFriends() {
    const friends: any = await axios.get(`/api/friends/getFriends/${userId}`)
    console.log('here', friends.data);
    setFriends(friends.data);
  }


  useEffect(() => {
    console.log('chyeah', searchParams);
    getUserFriends();
  }, [])


    const friendsListItems = friends.map((friend: any, index: number) => {
      return <li key={index}>{friend.firstName}</li>
    })


  return (
    <div>
      <h1>UserPage!!!</h1>
      <p>  { searchParams } </p>
      <p> { coolThing } </p>
      <p> { userId } </p>
      <ul>
        { friendsListItems }
      </ul>
    </div>
  )
};

interface UserPageProps {
  coolThing: string
}

export default UserPage;