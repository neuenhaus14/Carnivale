import React, {useEffect, useState, useContext, createContext} from 'react';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useLoaderData} from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './ProtectedRoutes'
import axios from 'axios';

import FeedPage from './FeedPage'
import HomePage from './HomePage'
import MapPage from './MapPage'
import UserPage from './UserPage'
import Login from './Login'
import MainForum from './MainForum';
import Costume from './Costume';
import EventPage from './EventPage';
import NavBar from './NavBar';
import Loading from './Loading';


const App = () => {

  const [lng, setLng] = useState(0)
  const [lat, setLat] = useState(0)
  //set useContext
  //const LocContext = React.createContext()
  const getLocation = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(showPosition)
    } else {
      console.log("Geolocation is not supported by this browser")
      return null
    }
  }

  const showPosition = (position: any) => {
    //console.log(position)
    setLng(position.coords.longitude);
    setLat(position.coords.latitude);
  }

  //console.log('user coords from app', lng, lat)

  // useEffect(() => {
  //   getLocation();
  // }, []);


  // const { user } = useAuth0();

  // const getUserLoader = async() => {
  //   try {      
  //     const { data } = await axios.post(`api/home/user/`, { user });
  //     console.log('userdata', data)
  //        data "{\"user\":{\"given_name\":\"Kitty\",\"family_name\":\"Scripters\",\"nickname\":\"kittyscripters\",\"name\":\"Kitty Scripters\",
  //     return data
  //   } catch (err){
  //     console.error(err);
  //   }
  // }


  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
          <Route path='/' element={<Login />} />
        {/* <Route element={<ProtectedRoute />}>  */}
        {/* <LocContext.Provider value={{lat, lng}}> */}
          <Route path='/homepage' element={<div><HomePage getLocation={getLocation} lat={lat} lng={lng}/> <NavBar /></div>}  />
        {/* </LocContext.Provider>  */}
          <Route path='/mainforum' element={<div><MainForum /> <NavBar /></div>} />
          <Route path='/costume' element={<div><Costume /> <NavBar /></div>} />
          <Route path='/mappage' element={<div><MapPage /> <NavBar /></div>}/>
          <Route path='/feedpage' element={<div><FeedPage /> <NavBar /></div>}/>
          <Route path='/eventpage' element={<div><EventPage /> <NavBar /></div>} />
          <Route path='/userpage' element={<div><UserPage coolThing = 'string1'/> <NavBar /></div>} />
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
