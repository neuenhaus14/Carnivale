import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import HomeModal from "./HomeModal";
import WeatherCard from "./WeatherCard";
import PostCard from "./PostCard";
import LocContext from "./App"

//PARENT OF HOMEMODAL

interface HomePageProps {
  getLocation: any
  lat: number
  lng: number
}

const HomePage: React.FC<HomePageProps> = ({getLocation, lat, lng, userData}) => {
  const { user } = useAuth0();
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState("posts");

  useEffect(() => {
    getLocation()
  }, []);

  // const getUser = async () => {
  //   try {
  //     const { data } = await axios.post(`api/home/user/`, { user });
  //     setUserId(data[0].id);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  useEffect(() => {
    if(userData !== null){
      setUserId(userData.id)
    }
  }, [userData])

  const modalTrigger = () => {
   setShowModal(true)
  }


  const handleSubmit = async() => {
    try {
      axios.post(`/api/home/${userId}`, { comment });
    } catch (err) {
      console.error(err);
    } finally {
      getPosts(key);
    }
  };

  const getPosts = async (e: string) => {
    try {
      const { data } = await axios.get(`/api/home/${e}`);
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
   // getUser();
    getPosts(key);
    const interval = setInterval(() => {
      getPosts(key);
      //console.log("fetch");
    }, 5000);
    return () => clearInterval(interval);
  }, [key]);

  return (
    <Container>
      <Row>
        <h1>HomePage!</h1>
      </Row>

      <Row>
        <WeatherCard />
      <button onClick={modalTrigger}>
        Upload a pic!
      </button>
      { showModal ?
      <HomeModal
        setShowModal={setShowModal}
        lat={lat}
        lng={lng}
       />
      : null
    }
      </Row>

      <Row>
        <Tabs
          activeKey={key}
          onSelect={(k) => {
            setKey(k);
            getPosts(k);
          }}
        >
          <Tab
            eventKey="posts"
            title="All"
          >
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                  />
                ))
              : ""}
          </Tab>
          <Tab
            eventKey="costumes"
            title="Costumes"
          >
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                  />
                ))
              : ""}
          </Tab>
          <Tab
            eventKey="throws"
            title="Throws"
          >
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                  />
                ))
              : ""}
          </Tab>
        </Tabs>
      </Row>

      {key === "posts" ? (
        <Row>
          <Form>
            <Form.Group>
              <Form.Label>COMMENT</Form.Label>
              <Form.Control onChange={(e) => setComment(e.target.value)} />
              <Button
                variant="primary"
                onClick={() => handleSubmit()}
              >
                SEND!!!
              </Button>
            </Form.Group>
          </Form>
        </Row>
      ) : (
        ""
      )}
    </Container>
  );
};

export default HomePage;
