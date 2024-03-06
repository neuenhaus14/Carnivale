import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Tab,
  Tabs,
  Modal,
} from 'react-bootstrap';
import { FaCommentDots } from '@react-icons/all-files/fa/FaCommentDots';

import { FaCamera } from '@react-icons/all-files/fa/FaCamera';

import axios from 'axios';
import HomeModal from './HomeModal';
import PostCard from './PostCard';
import { RunModeContext, ThemeContext } from './Context';
import { useSearchParams } from 'react-router-dom';

//PARENT OF HOMEMODAL

interface HomePageProps {
  lat: number;
  lng: number;
  userId: number;
}

const HomePage: React.FC<HomePageProps> = ({ lat, lng /*userId*/ }) => {
  const [searchParams] = useSearchParams();
  const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState('posts');
  const [order, setOrder] = useState('upvotes');
  const theme = useContext(ThemeContext);

  const isDemoMode = useContext(RunModeContext) === 'demo';

  const [showAboutModal, setShowAboutModal] = useState(true);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  const modalTrigger = () => {
    setShowModal(true);
  };

  function handleInput(e: any) {
    setComment(e.target.value);
  }

  function handleKeyDown(e: any) {
    //if key is enter, prevent default
    // if (e.key === "Enter" && comment.length > 0) {
    //   //if comment is valid, submit comment
    //   e.preventDefault();
    //   handleSubmit();
    // } else if (e.key === "Enter") {
    //   e.preventDefault();
    // }
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
      if (order === 'upvotes') {
        setPosts(
          data.sort(
            (a: any, b: any) =>
              (b[order as string] as number) - (a[order as string] as number)
          )
        );
      } else {
        setPosts(
          data.sort(
            (a: any, b: any) =>
              (new Date(b[order as any]) as any) -
              (new Date(a[order as any]) as any)
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    //on initial render, or tab click
    //getPosts and setInterval for 5 sec
    getPosts(key);
    const interval = setTimeout(() => {
      getPosts(key);
    }, 15000);
    return () => clearTimeout(interval);
  }, [key, order]);

  console.log;
  return (
    <Container className={`body-home ${theme}`}>
      {isDemoMode && (
        <Modal show={showAboutModal} onHide={toggleAboutModal}>
          <Modal.Header closeButton>
            <Modal.Title>DEMO MODE: Home Page</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='fs-6 lh-sm'>
              <b>Welcome to Pardi Gras!</b> <br />
              <br />
              This is a demo version of Pardi Gras. Feel free to explore the
              app&apos;s features, but please note that much of its core
              functionality is disabled in this version.
              <br />
              <br />
              After closing this window you&apos;ll be on the Home page, which
              features a crowd-sourced global content feed covering Mardi Gras
              gossip, costumes and throws.
              <br />
              <br />
              Here you can discover the most recent or popular posts and create
              your own content to share with the Mardi Gras community. Upvote a
              post to send it up the ranks, or downvote it if it&apos;s not up
              to snuff.
              <br />
              <br />
              <b>Got a sec?</b> Please take the{' '}
              <a href='https://docs.google.com/forms/d/e/1FAIpQLSfSGLNva3elpadLqpXw1WuD9b4H39lBuX6YMiKT5_o2DNQ7Gg/viewform'>
                Survey
              </a>{' '}
              and let us know what you think!
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={toggleAboutModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Row>
        <div
          key={'inline-radio'}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '15px',
          }}
        >
          Sort by:
          <Form.Check
            style={{ marginLeft: '20px' }}
            type='radio'
            name='Sort'
            label='Newest'
            inline
            onClick={() => setOrder('createdAt')}
          />
          <Form.Check
            type='radio'
            name='Sort'
            label='Upvotes'
            inline
            onClick={() => setOrder('upvotes')}
          />
        </div>
      </Row>

      <Row>
        <div className='homePage-tabs'>
          <Tabs activeKey={key} onSelect={handleSelect}>
            <Tab eventKey='posts' title='Gossip'>
              {posts
                ? posts.map((item: any, index: number) => (
                    <PostCard
                      key={`${item.id} + ${index}`}
                      post={item}
                      userId={userId}
                      getPosts={getPosts}
                      order={order}
                      eventKey={'posts'}
                    />
                  ))
                : ''}
            </Tab>
            <Tab eventKey='costumes' title='Costumes'>
              {posts
                ? posts.map((item: any, index: number) => (
                    <PostCard
                      key={`${item.id} + ${index}`}
                      post={item}
                      userId={userId}
                      getPosts={getPosts}
                      order={order}
                      eventKey={'costumes'}
                    />
                  ))
                : ''}
            </Tab>
            <Tab eventKey='throws' title='Throws'>
              {posts
                ? posts.map((item: any, index: number) => (
                    <PostCard
                      key={`${item.id} + ${index}`}
                      post={item}
                      userId={userId}
                      getPosts={getPosts}
                      order={order}
                      eventKey={'throws'}
                    />
                  ))
                : ''}
            </Tab>
          </Tabs>
        </div>
      </Row>
      {key === 'posts' ? (
        <Row>
          <div className='page-bottom-panel' id='create-post-form'>
            <Form style={{ width: '100%' }}>
              <Form.Group>
                <div className='d-flex flex-row'>
                  <Form.Control
                    className='mx-1'
                    placeholder='Post a comment or photo'
                    onChange={handleInput}
                    value={comment}
                    onKeyDown={(e) => {
                      handleKeyDown(e);
                    }}
                  />
                  <Button
                    variant='primary'
                    onClick={handleSubmit}
                    disabled={isDemoMode || comment.length <= 0}
                    className='btn-center-icon rounded-circle mx-1'
                  >
                    <FaCommentDots />
                  </Button>
                  <Button
                    onClick={modalTrigger}
                    className='btn-center-icon rounded-circle mx-1'
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
                </div>
              </Form.Group>
            </Form>
          </div>
        </Row>
      ) : (
        ''
      )}
    </Container>
  );
};

export default HomePage;
