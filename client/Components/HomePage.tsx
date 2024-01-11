import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Tab,
  Tabs,
  DropdownButton,
  Dropdown
} from 'react-bootstrap';
import { FaCamera, FaCommentDots } from 'react-icons/fa';
import axios from 'axios';
import HomeModal from './HomeModal';
import PostCard from './PostCard';

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
  const [order, setOrder] = useState('updatedAt');

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

      setPosts(data.sort((a: any, b: any) => b[order] - a[order]));
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
      console.log('fetch', order);
    }, 5000);
    return () => clearInterval(interval);
  }, [key, order]);

  return (
    <Container className='body-home'>
      <Row>
        <DropdownButton
          className='my-3 mx-auto'
          style={{ width: '200px' }}
          title='Sort'
          onSelect={setOrder}
        >
          <Dropdown.Item eventKey={'updatedAt'}>Updated</Dropdown.Item>
          <Dropdown.Item eventKey={'createdAt'}>Created</Dropdown.Item>
          <Dropdown.Item eventKey={'upvotes'}>Upvotes</Dropdown.Item>
        </DropdownButton>
      </Row>

      <Row>
        <Tabs
          activeKey={key}
          onSelect={handleSelect}
        >
          <Tab
            eventKey='posts'
            title='Gossip'
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
        <Card
          className='comment-form'
          style={{ position: 'fixed', bottom: '12vh' }}
        >
          <Form
          style={{width: '100%'}}
          >
            <Form.Group>
              <Form.Control
                onChange={handleInput}
                value={comment}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
              />
              <Button
                onClick={modalTrigger}
                className='photo-btn'
              >
                <FaCamera />
              </Button>
              {showModal ? (
                <HomeModal
                  setShowModal={setShowModal}
                  lat={lat}
                  lng={lng}
                  userId={userId}
                />
              ) : null}
              <Button
                variant='primary'
                onClick={handleSubmit}
                disabled={comment.length <= 0}
                className='comment-btn'
              >
                <FaCommentDots />
              </Button>
            </Form.Group>
          </Form>
        </Card>
        </Row>
      ) : (
        ''
      )}
    </Container>
  );
};

export default HomePage;
