import React, { useState, useEffect} from "react";
import { Card, Form, Button } from "react-bootstrap";
import axios from "axios";

import WeatherCard from "./WeatherCard";
import PostCard from "./PostCard";

const HomePage = () => {
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState('1');
  const [posts, setPosts] = useState(null);

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

      {/* temporary */}
      <Form>
        <Form.Group>
          <Form.Label>UserId</Form.Label>
          <Form.Control onChange={(e) => setUserId(e.target.value)} />
        </Form.Group>
      </Form>
      {/* temporary */}

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
