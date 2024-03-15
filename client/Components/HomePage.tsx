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
  Col,
} from 'react-bootstrap';
import { FaCommentDots } from '@react-icons/all-files/fa/FaCommentDots';

import { FaCamera } from '@react-icons/all-files/fa/FaCamera';

import axios from 'axios';
import HomeModal from './HomeModal';
import { PostCard } from './PostCard';
import { RunModeContext, ThemeContext } from './Context';
import { useSearchParams } from 'react-router-dom';

//PARENT OF HOMEMODAL

interface HomePageProps {
  lat: number;
  lng: number;
  userId: number;
  setShareModalBundle: any;
  setConfirmActionBundle: any;
}

const HomePage: React.FC<HomePageProps> = ({
  setConfirmActionBundle,
  setShareModalBundle,
  lat,
  lng,
  userId,
}) => {
  // const [searchParams] = useSearchParams();
  // const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState(null);

  const [showHomeModal, setShowHomeModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(true);

  const [key, setKey] = useState('posts');
  const [order, setOrder] = useState('upvotes');

  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  const toggleHomeModal = () => {
    setShowHomeModal(true);
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

  // when tab is changed, set tab key and getPost for that tab
  function handleSelect(key: string) {
    setKey(key);
    getPosts(key);
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

  // fetches all
  const getPosts = async (contentType: string) => {
    try {
      const { data } = await axios.get(`/api/home/${contentType}`);
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

  const CreateContentForm: React.FC = () => {
    return (
      <Form style={{ width: '100%' }}>
        <Form.Group>
          <div className='d-flex flex-row'>
            <Form.Control
              className='mx-2'
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
              onClick={toggleHomeModal}
              className='btn-center-icon rounded-circle mx-1'
            >
              <FaCamera />
            </Button>
          </div>
        </Form.Group>
      </Form>
    );
  };

  return (
    <Container
      className={`body-with-bottom-panel ${theme} home-page-container`}
    >
      {showHomeModal && (
        <HomeModal
          setShowHomeModal={setShowHomeModal}
          lat={lat}
          lng={lng}
          userId={userId}
        />
      )}
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
        <Col>
          <div
            style={{
              height: '9vh',
            }}
            className='d-flex flex-row justify-content-around align-items-center'
          >
            <Form className='d-flex flex-row justify-content-center align-items-center'>
              <Form.Label className='mb-0 mx-2'>Sort posts by:</Form.Label>
              <Form.Check
                className='mb-0 mx-2'
                type='radio'
                name='Sort'
                label='Newest'
                onChange={() => setOrder('createdAt')}
                checked={order === 'createdAt'}
              />
              <Form.Check
                className='mb-0 mx-2'
                type='radio'
                name='Sort'
                label='Upvotes'
                onChange={() => setOrder('upvotes')}
                checked={order === 'upvotes'}
              />
            </Form>
            <div className='d-none d-lg-flex d-xl-flex d-xxl-flex w-50'>
              <CreateContentForm />
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className='home-page-tabs'>
            <Tabs activeKey={key} onSelect={handleSelect}>
              <Tab eventKey='posts' title='Gossip'>
                {posts
                  ? posts.map((post: any, index: number) => (
                      <PostCard
                        key={`${post.id} + ${index}`}
                        post={post}
                        userId={userId}
                        eventKey={'posts'}
                        setShareModalBundle={setShareModalBundle}
                        childFunctions={{
                          getPosts,
                        }}
                        setConfirmActionBundle={setConfirmActionBundle}
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
                        eventKey={'costumes'}
                        childFunctions={{
                          getPosts,
                        }}
                        setShareModalBundle={setShareModalBundle}
                        setConfirmActionBundle={setConfirmActionBundle}
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
                        eventKey={'throws'}
                        childFunctions={{
                          getPosts,
                        }}
                        setShareModalBundle={setShareModalBundle}
                        setConfirmActionBundle={setConfirmActionBundle}
                      />
                    ))
                  : ''}
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>

      <Row>
        <div className='page-bottom-panel' id='create-post-form'>
          <CreateContentForm />
          {/* <Form style={{ width: '100%' }}>
            <Form.Group>
              <div className='d-flex flex-row'>
                <Form.Control
                  className='mx-2'
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
                  onClick={toggleHomeModal}
                  className='btn-center-icon rounded-circle mx-1'
                >
                  <FaCamera />
                </Button>
              </div>
            </Form.Group>
          </Form> */}
        </div>
      </Row>
    </Container>
  );
};

export default HomePage;
