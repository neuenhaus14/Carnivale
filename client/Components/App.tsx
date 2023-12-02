import React from 'react';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'


import FeedPage from './FeedPage'
import HomePage from './HomePage'
import MapPage from './MapPage'
import UserPage from './MapPage'
import Login from './Login'
import MainForum from './MainForum';
import Costume from './Costume';
import EventPage from './EventPage';
import ProtectedRoutes from './ProtectedRoutes'

const App = () => {

  // add user loader data 
  // is logged in loader to pass to private routes to make sure user is logged in

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* <Route element={<ProtectedRoutes />}>  */}
          <Route path='/homepage' element={<HomePage />} >
            <Route path='mainforum' element={<MainForum />} />
            <Route path='costume' element={<Costume />} />
          </Route>
          <Route path='/mappage' element={<MapPage />} />
          <Route path='/feedpage' element={<FeedPage />} >
            <Route path='eventpage' element={<EventPage />} />
          </Route>  
          <Route path='/userpage' element={<UserPage />} >
            <Route path='eventpage' element={<EventPage />} />
          </Route>  
          <Route path='/login' element={<Login />} />
        {/* </Route> */}
          <Route path='/' element={<Login />} />
      </Route>,
    ),
  );

  return (
    <RouterProvider router={router} />
  );

};

export default App;
