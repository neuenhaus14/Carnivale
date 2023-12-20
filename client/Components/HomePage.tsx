import React, { useState, useEffect, useContext } from 'react';
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
import axios from "axios";
import HomeModal from "./HomeModal";
import WeatherCard from "./WeatherCard";
import PostCard from "./PostCard";

//PARENT OF HOMEMODAL

interface HomePageProps {
  lat: number;
  lng: number;
  userId: number;
}

const HomePage: React.FC<HomePageProps> = ({ lat, lng, userId }) => {
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState('posts');
  const [key, setKey] = useState("posts");
  const theme = useContext(ThemeContext);

  // useEffect(() => {
  //   getLocation()
  // }, []);

  // const getUser = async () => {
  //   try {
  //     const { data } = await axios.post(`api/home/user/`, { user });
  //     setUserId(data[0].id);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // useEffect(() => {
  //   if(userData !== null){
  //     setUserId(userData.id)
  //     getLocation()
  //   }
  // }, [userData])

  const modalTrigger = () => {
    setShowModal(true);
  };

  function handleInput(e: any) {
    setComment(e.target.value);
  }

  function handleKeyDown(e: any) {
    //if key is enter, prevent default
    if (e.key === 'Enter' && comment.length > 0) {
      //if comment is valid, submit comment
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  //when tab is changed, set tab key and getPost for that tab
  function handleSelect(k: string) {
    setKey(k);
    getPosts(k);
  }

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/home/${userId}`, { comment });
      setComment('');
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
      console.log(theme);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    //on initial render, or tab click
    //getPosts and setInterval for 5 sec
    getPosts(key);
    const interval = setInterval(() => {
      getPosts(key);
      console.log('fetch');
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
        <button onClick={modalTrigger}>Upload a pic!</button>
        {showModal ? (
          <HomeModal
            setShowModal={setShowModal}
            lat={lat}
            lng={lng}
            userId={userId}
          />
        ) : null}
      </Row>

      <Row>
        <Tabs
          activeKey={key}
          onSelect={handleSelect}
        >
          <Tab
            eventKey='posts'
            title='All'
          >
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                  />
                ))
              : ''}
          </Tab>
          <Tab
            eventKey='costumes'
            title='Costumes'
          >
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                  />
                ))
              : ''}
          </Tab>
          <Tab
            eventKey='throws'
            title='Throws'
          >
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                  />
                ))
              : ''}
          </Tab>
        </Tabs>
      </Row>

      {key === 'posts' ? (
        <Row>
          <Form>
            <Form.Group>
              <Form.Label>COMMENT</Form.Label>
              <Form.Control
                onChange={handleInput}
                value={comment}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
              />
              <Button
                variant='primary'
                onClick={handleSubmit}
                disabled={comment.length <= 0}
              >
                SEND!!!
              </Button>
            </Form.Group>
          </Form>
        </Row>
      ) : (
        ''
      )}
    </Container>
  );
};

export default HomePage;
