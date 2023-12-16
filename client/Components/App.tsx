import React, {useEffect, useState, useContext, createContext, useRef} from 'react';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useLoaderData} from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './ProtectedRoutes'
import axios from 'axios';
import { io } from 'socket.io-client'
const socket = io()

import FeedPage from './FeedPage'
import HomePage from './HomePage'
import MapPage from './MapPage'
import UserPage from './UserPage'
import Login from './Login'
import EventPage from './EventPage';
import NavBar from './NavBar';
import Loading from './Loading';
import Parades from './Parades'


const App = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(0);
  const userRef = useRef(null);

  const [lng, setLng] = useState(0)
  const [lat, setLat] = useState(0)



  const getUser = async () => {
    try {
      const { data } = await axios.post(`api/home/user/`, { user });
      console.log('userId', data[0].id)
      setUserData(data[0]);
      setUserId(data[0].id)
      return data[0].id
    } catch (err) {
      console.error(err);
    }
  }
  
  if(isAuthenticated){
    if(userRef.current === null){
      getUser();
      userRef.current = userData;
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(showPosition)
    } else {
      console.log("Geolocation is not supported by this browser")
      return null
    }
  }
  
  const showPosition = (position: any) => {
    // it first inits with the emit when home page calls the function, 
    // this is sent to the server side to udate the database
    console.log('userId in socket', userId)
    //socket.emit('userLoc', {longitude: position.coords.longitude, latitude: position.coords.latitude, id: userId })
    socket.emit('userLoc', {longitude: position.coords.longitude, latitude: position.coords.latitude, id: 1 })
  }

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    // this coords is data.dataValues from the database as a response to the emit
    socket.on('userLoc', (coords: any) => {
      console.log('userLoc', coords.longitude, coords.latitude)

      //set the coords with the response
      setLng(coords.longitude);
      setLat(coords.latitude);
    })

  }, [])





  if (isLoading) {
    return <Loading />;
  }



  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
          <Route path='/' element={<Login />} />
        {/* <Route element={<ProtectedRoute />}>  */}
          <Route path='/homepage' element={<div><HomePage lat={lat} lng={lng} /> <NavBar /></div>}  />
          <Route path='/mappage' element={<div><MapPage userLat={lat} userLng={lng} userId={userId}/> <NavBar /></div>}/>
          <Route path='/parades' element={<div><Parades /> <NavBar /></div>}/>
          <Route path='/feedpage' element={<div><FeedPage userId={userId}/> <NavBar /></div>}/>
          <Route path='/eventpage' element={<div><EventPage getLocation={getLocation} lng={lng} lat={lat}/> <NavBar /></div>} />
          <Route path='/userpage' element={<div><UserPage getLocation = {getLocation} lng={lng} lat={lat} userId={userId} /> <NavBar /></div>} />
          {/* <Route path='/photo' element={<div><Photos /> <NavBar /></div>} /> */}
        {/* </Route>  */}
      </Route>,
    ),
  );

  return (
    <RouterProvider router={router} />
  );

};

export default App;
