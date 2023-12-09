import React, { useState, useEffect} from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import WeatherCard from "./WeatherCard";
import PostCard from "./PostCard";

const HomePage = () => {
  const { user } = useAuth0();
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState(null);

  const getUser = async() => {
    try {      
      const { data } = await axios.post(`api/home/user/`, { user });
      setUserId(data[0].id);
    } catch (err){
      console.error(err);
    }
  }



  const handleSubmit = async() => {
    try {
      axios.post(`/api/home/${userId}`, { comment });
    } catch (err){
      console.error(err);
    } finally {
      getPosts();
    }
  }

  const getPosts = async () => {
    try {
      const { data } = await axios.get(`/api/home/posts`);
      setPosts(data);
    } catch (err){
      console.error(err);
    }
  }

  useEffect(() => {
    getUser();
    getPosts();
    const interval = setInterval(() => {
      getPosts();
      console.log('fetch');
    }, 5000);
    return () => clearInterval(interval)
  }, [])


  return (
    <div>
      <h1>HomePage!</h1>

      <WeatherCard />
      {
        posts
        ? posts.map((item: any, index: number) => (
          <PostCard key={`${item.id} + ${index}`} post={item}/>
        ))
        : ''
      }
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
    </div>
  );
};

export default HomePage;
