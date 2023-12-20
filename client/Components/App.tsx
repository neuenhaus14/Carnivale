import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useRef,
} from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLoaderData,
} from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './ProtectedRoutes';
import axios from 'axios';
import { io } from 'socket.io-client';
const socket = io();
import FeedPage from './FeedPage';
import HomePage from './HomePage';
import MapPage from './MapPage';
import UserPage from './UserPage';
import Login from './Login';
import EventPage from './EventPage';
import NavBar from './NavBar';
import Loading from './Loading';
import Parades from './Parades';

const App = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const userRef = useRef(null);

  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  // this gets user from database
  // sets user state
  const getUser = async () => {
    try {
      const { data } = await axios.post(`api/home/user/`, { user });
      // console.log('userId', data[0].id)
      setUserData(data[0]);
      setUserId(data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  // this get coordinates from the browser
  const getLocation = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(
        showPosition,
        (error) => console.log(error),
        { enableHighAccuracy: true }
      );
    } else {
      console.log('Geolocation is not supported by this browser');
      return null;
    }
  };

  // this sends coordinates to socket
  const showPosition = (position: any) => {
    //console.log(position)
    setLng(position.coords.longitude);
    setLat(position.coords.latitude);

    console.log(
      'accuracy: off by ' + position.coords.accuracy / 1609 + ' miles'
    );
    console.log(
      'userId in socket, userID',
      userId,
      'long/lat',
      position.coords.longitude,
      position.coords.latitude
    );

    socket.emit('userLoc', {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      id: userId,
    });
  };

  // The two useEffects below both run on the first load,
  // but have conditions to check if the next operation
  // should execute.
  // 1st: auth0 sends user object in, is Authenticated switches
  // 2nd: provided a user object, useEffect gets the
  // logged in user's info from the database
  // 3rd: provided a non-null userId, the user's location
  // is looked up and emitted to socket.io server
  useEffect(() => {
    if (user) {
      getUser();
      userRef.current = userData; // do we need this?
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('userId changes');
    if (userId !== null) {
      console.log('userRef.current is not null');
      getLocation();
    }
  }, [userId]);

  // useEffect(() => {
  //   // this coords is data.dataValues from the database as a response to the emit
  //   socket.on('userLoc', (coords: any) => {
  //     console.log('userLoc', coords.longitude, coords.latitude)

  //     //set the coords with the response
  //     setLng(coords.longitude);
  //     setLat(coords.latitude);
  //   })
  // }, [])

  if (isLoading) {
    return <Loading />;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/' element={<Login />} />
        {/* <Route element={<ProtectedRoute />}>  */}
        <Route
          path='/homepage'
          element={
            <div>
              <HomePage userId={userId} lat={lat} lng={lng} /> <NavBar />
            </div>
          }
        />
        <Route
          path='/mappage'
          element={
            <div>
              <MapPage
                userLat={lat}
                userLng={lng}
                userId={userId}
                getLocation={getLocation}
              />{' '}
              <NavBar />
            </div>
          }
        />
        <Route
          path='/feedpage'
          element={
            <div>
              <FeedPage userId={userId} /> <NavBar />
            </div>
          }
        />
        <Route
          path='/parades'
          element={
            <div>
              <Parades /> <NavBar />
            </div>
          }
        />
        <Route
          path='/eventpage'
          element={
            <div>
              <EventPage
                userId={userId}
                getLocation={getLocation}
                lng={lng}
                lat={lat}
              />{' '}
              <NavBar />
            </div>
          }
        />
        <Route
          path='/userpage'
          element={
            <div>
              <UserPage
                userId={userId}
                getLocation={getLocation}
                lng={lng}
                lat={lat}
              />{' '}
              <NavBar />
            </div>
          }
        />
        {/* </Route>  */}
      </Route>
    )
  );

  console.log('bottom of app', userId, lng, lat);
  return <RouterProvider router={router} />;
};

export default App;
