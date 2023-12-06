import React from 'react';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'


import FeedPage from './FeedPage'
import HomePage from './HomePage'
import MapPage from './MapPage'
import UserPage from './UserPage'
import Login from './Login'
import MainForum from './MainForum';
import Costume from './Costume';
import EventPage from './EventPage';
import NavBar from './NavBar';
//import ProtectedRoutes from './ProtectedRoutes'

// NOTE: mainforum, costume, and event page were supposed to be babies of their parent elements, 
// cant figure out how to route to them tho.... 

const App = () => {

  // add user loader data 
  // is logged in loader to pass to private routes to make sure user is logged in
  const userId = '1'

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* <Route element={<ProtectedRoutes />}>  */}
          <Route path='/homepage' element={<div><HomePage /> <NavBar /></div>} />
          <Route path='/mainforum' element={<div><MainForum /> <NavBar /></div>} />
          <Route path='/costume' element={<div><Costume /> <NavBar /></div>} />
          <Route path='/mappage' element={<div><MapPage /> <NavBar /></div>} />
          <Route path='/feedpage' element={<div><FeedPage /> <NavBar /></div>} />
          <Route path='/eventpage' element={<div><EventPage /> <NavBar /></div>} />
          <Route path='/userpage' element={<div><UserPage coolThing = 'string1'/> <NavBar /></div>} />
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
