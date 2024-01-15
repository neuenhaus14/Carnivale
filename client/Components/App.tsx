import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useRef,
} from "react";
import {
  Link,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLoaderData,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./ProtectedRoutes";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io();
import FeedPage from "./FeedPage";
import HomePage from "./HomePage";
import MapPage from "./MapPage";
import UserPage from "./UserPage";
import Login from "./Login";
import EventPage from "./EventPage";
import NavBar from "./NavBar";
import Loading from "./Loading";
import Parades from "./Parades";
import { ThemeContext } from "./Context";
import TopNavBar from "./TopNavBar";

const App = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [theme, setTheme] = useState("pg-theme-light");

  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  // this gets user from database
  // sets user state
  const getUser = async () => {
    try {
      const { data } = await axios.post(`api/home/user/`, { user });
      console.log("userId", data[0].id);
      setUserData(data[0]);
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

    // socket.emit("getFriends:read", {userId})
    // console.log('socket emitted from App')
  };


  useEffect(() => {
    // if (userId !== null) {
      axios.patch('/userLoc', {
        longitude: lng,
        latitude: lat,
        id: userId,
      }).then().catch(err => console.log(err))
    //}
  }, [lng]) // the other option here is [setLng] to save to DB at the rate of the sockets, but once should be fine to fix the friend bug


  // this get coordinates from the browser
  const getLocation = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(
        showPosition,
        (error) => console.log(error),
        { enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
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
  }, [isAuthenticated]);

  useEffect(() => {
    if (userId !== null) {
      getLocation();
    }
  }, [userId]);

  // this could be irrelevant -gn 1/15/24
  useEffect(() => {
    // this coords is data.dataValues from the database as a response to the emit
    socket.on('userLoc response', (userLoc: any) => {
      // console.log('userLoc response in App', userLoc)
    })
  }, [])


  if (isLoading) {
    return <Loading />;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Login />} />
        {/* <Route element={<ProtectedRoute />}>  */}
        <Route
          path="/homepage"
          element={
            <div>
              <TopNavBar title={user ? `Welcome ${user.given_name}!` : ""} />
              <HomePage userId={userId} lat={lat} lng={lng} /> <NavBar />
            </div>
          }
        />
        <Route
          path="/mappage"
          element={
            <div>
              <Link to="/homepage">
                <TopNavBar title={"Map"} />
              </Link>
              <MapPage
                userLat={lat}
                userLng={lng}
                userId={userId}
                getLocation={getLocation}
              />{" "}
              <NavBar />
            </div>
          }
        />
        <Route
          path="/feedpage"
          element={
            <div>
              <Link to="/homepage">
                <TopNavBar
                  title={user ? `${user.given_name}'s Feed` : "Feed"}
                />
              </Link>
              <FeedPage userId={userId} /> <NavBar />
            </div>
          }
        />
        <Route
          path="/parades"
          element={
            <div>
              <Link to="/homepage">
                <TopNavBar title={"Parades"} />
              </Link>
              <Parades userId={userId} lng={lng} lat={lat} /> <NavBar />
            </div>
          }
        />
        <Route
          path="/eventpage"
          element={
            <div>
              <Link to="/homepage">
                <TopNavBar title={"Live Music"} />
              </Link>
              <EventPage
                userId={userId}
                getLocation={getLocation}
                lng={lng}
                lat={lat}
              />{" "}
              <NavBar />
            </div>
          }
        />
        <Route
          path="/userpage"
          element={
            <div>
              <Link to="/homepage">
                <TopNavBar title={"User"} />
              </Link>
              <UserPage
                userId={userId}
                lng={lng}
                lat={lat}
                setTheme={setTheme}
              />{" "}
              <NavBar />
            </div>
          }
        />
        {/* </Route>  */}
      </Route>
    )
  );

  console.log("bottom of app", userId, lng, lat, "theme", theme);
  return (
    <ThemeContext.Provider value={theme}>
      <RouterProvider router={router} />
    </ThemeContext.Provider>
  );
};

export default App;
