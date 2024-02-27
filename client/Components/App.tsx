import React, {
  useEffect,
  useState,
  useContext,
  // createContext,
  // useRef,
} from 'react';
import {
  Link,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  // useLoaderData,
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
import { ThemeContext, RunModeContext } from './Context';
import TopNavBar from './TopNavBar';

const App = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();

  // WHAT DOES userData DO?
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currWeather, setCurrWeather] = useState('');
  const [currTemp, setCurrTemp] = useState('');

  const [theme, setTheme] = useState('pg-theme-light');

  const isDemoMode = useContext(RunModeContext) === 'demo';

  // start with NOLA coordinates
  const [lng, setLng] = useState(-90.0715);
  const [lat, setLat] = useState(29.9511);

  // this gets user from database
  // sets user state. This function runs
  // when user is set from Auth0, which happens
  // on Auth0 login
  const getUser = async () => {
    try {
      const { data } = await axios.post(`api/home/user/`, { user });

      console.log('userId', data[0].id);
      setUserData(data[0].id);
      setUserId(data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  // this sends coordinates to socket
  const showPosition = (position: any) => {
    setLng(position.coords.longitude);
    setLat(position.coords.latitude);

    socket.emit('userLoc', {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      id: userId,
    });
  };

  // updates userLoc in db after
  // lng is updated
  useEffect(() => {
    axios
      .patch('/userLoc', {
        longitude: lng,
        latitude: lat,
        id: userId,
      })
      .then()
      .catch((err) => console.error(err));
  }, [lng]);

  // gets coordinates from the browser
  // calls showPosition, which updates
  // lng, which causes lng and lat to get saved to db
  // thru above useEffect
  const getLocation = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(
        showPosition,
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      return null;
    }
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
    user && getUser();
    if (isDemoMode) {
      setUserId(1);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userId !== null) {
      getLocation();
    }
  }, [userId]);

  const getWeather = async () => {
    try {
      const { data } = await axios.get(`/api/weather/${lat},${lng}`);
      setCurrWeather(data.current.condition.icon);
      setCurrTemp(data.current.temp_f);
    } catch (err) {
      console.error(err);
    }
  };

  // makes sure weather doesn't keep refreshing whenever lat changes
  let weatherRefreshCount = 0;
  useEffect(() => {
    if (weatherRefreshCount < 2 && lat !== 0) {
      getWeather();
      weatherRefreshCount += 1;
    }
  }, [lat]);

  if (isLoading || (isLoading && lng === 0 && user)) {
    return <Loading />;
  }

  console.log('isDemoMode', isDemoMode, 'user', userId);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/' element={<Login />} />
        <Route element={isDemoMode ? null : <ProtectedRoute />}>
          <Route
            path='/homepage'
            element={
              <div>
                <TopNavBar
                  title={
                    user ? `Welcome, ${user.given_name}!` : 'Welcome, Friend!'
                  }
                  currWeather={currWeather}
                  currTemp={currTemp}
                />
                <HomePage userId={userId} lat={lat} lng={lng} /> <NavBar />
              </div>
            }
          />
          <Route
            path='/mappage'
            element={
              <div>
                <Link to='/homepage'>
                  <TopNavBar
                    title={'Map'}
                    currWeather={currWeather}
                    currTemp={currTemp}
                  />
                </Link>
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
                <Link to='/homepage'>
                  <TopNavBar
                    title={user ? `${user.given_name}'s Feed` : 'Feed'}
                    currWeather={currWeather}
                    currTemp={currTemp}
                  />
                </Link>
                <FeedPage userId={userId} /> <NavBar />
              </div>
            }
          />
          <Route
            path='/parades'
            element={
              <div>
                <Link to='/homepage'>
                  <TopNavBar
                    title={'Parades'}
                    currWeather={currWeather}
                    currTemp={currTemp}
                  />
                </Link>
                <Parades userId={userId} lng={lng} lat={lat} /> <NavBar />
              </div>
            }
          />
          <Route
            path='/eventpage'
            element={
              <div>
                <Link to='/homepage'>
                  <TopNavBar
                    title={'Live Music'}
                    currWeather={currWeather}
                    currTemp={currTemp}
                  />
                </Link>
                <EventPage userId={userId} lng={lng} lat={lat} /> <NavBar />
              </div>
            }
          />
          <Route
            path='/userpage'
            element={
              <div>
                <Link to='/homepage'>
                  <TopNavBar
                    title='Krewe & Calendar'
                    currWeather={currWeather}
                    currTemp={currTemp}
                  />
                </Link>
                <UserPage
                  userId={userId}
                  lng={lng}
                  lat={lat}
                  setTheme={setTheme}
                />{' '}
                <NavBar />
              </div>
            }
          />
        </Route>
      </Route>
    )
  );

  return (
    <RunModeContext.Provider value={process.env.RUN_MODE}>
      <ThemeContext.Provider value={theme}>
        <RouterProvider router={router} />
      </ThemeContext.Provider>
    </RunModeContext.Provider>
  );
};

export default App;
