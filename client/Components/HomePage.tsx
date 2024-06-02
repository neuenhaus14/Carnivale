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
import { PostCard } from './Cards/PostCard';
import { RunModeContext, ThemeContext, UserContext, ContentFunctionsContext } from './Context';
import { useSearchParams } from 'react-router-dom';
import { Post } from '../types';

// PARENT OF HOMEMODAL

interface HomePageProps {
  lat: number;
  lng: number;
  userId: number;
}

const HomePage: React.FC<HomePageProps> = ({
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

  const [key, setKey] = useState('all');
  const [order, setOrder] = useState('createdAt');

  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const userContextInfo = useContext(UserContext);
  const {setConfirmActionModalBundle, setCreateContentModalBundle, setShareModalBundle} = useContext(ContentFunctionsContext)

  const tabCategories = process.env.TAB_CATEGORIES.split(' ');

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
  function handleTabSelect(newKey: string) {
    setKey(newKey);
    getPosts(order, newKey);
  }

  function handleOrderSelect(newOrder: string) {
    setOrder(newOrder);
    getPosts(newOrder, key);
  }

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/home/${userId}`, { comment });
      setComment('');
    } catch (err) {
      console.error(err);
    } finally {
      getPosts(order, key);
    }
  };

  // fetches content according to order and key
  const getPosts = async (order: string, key: string) => {
    try {
      const postsResponse = await axios.get(
        `/api/content/getMainContent/userId=${userId}&order=${order}&category=${key}`
      );

      setPosts(postsResponse.data);
      /*
      // const { data } = await axios.get(`/api/home/${contentType}`);
      // if (order === 'upvotes') {
      //   setPosts(
      //     data.sort(
      //       (a: any, b: any) =>
      //         (b[order as string] as number) - (a[order as string] as number)
      //     )
      //   );
      // } else {
      //   setPosts(
      //     data.sort(
      //       (a: any, b: any) =>
      //         (new Date(b[order as any]) as any) -
      //         (new Date(a[order as any]) as any)
      //     )
      //   );
      // } */
    } catch (err) {
      console.error(err);
    }
  };

  // get posts on first render
  useEffect(() => {
    getPosts(order, key);
  }, []);

  // const CreateContentForm: React.FC = () => {
  //   return (
  //     <Form style={{ width: '100%' }}>
  //       <Form.Group>
  //         <div className='d-flex flex-row'>
  //           <Form.Control
  //             className='mx-2'
  //             placeholder='Post a comment or photo'
  //             onChange={handleInput}
  //             value={comment}
  //             onKeyDown={(e) => {
  //               handleKeyDown(e);
  //             }}
  //           />
  //           <Button
  //             variant='primary'
  //             onClick={handleSubmit}
  //             disabled={isDemoMode || comment.length <= 0}
  //             className='mx-1'
  //           >
  //             <FaCommentDots />
  //           </Button>
  //           <Button onClick={toggleHomeModal} className='mx-1'>
  //             <FaCamera />
  //           </Button>
  //         </div>
  //       </Form.Group>
  //     </Form>
  //   );
  // };

  tabCategories.unshift('All');
  const tabComponents = tabCategories.map((category, index) => {
    return (
      <Tab
        eventKey={category.toLowerCase()}
        title={category}
        key={`${category}-${index}`}
      >
        {posts
          ? posts.map((post: Post, index) => {
              return (
                <PostCard
                  key={`${post.content.id} + ${index}`}
                  post={post}
                  userId={userId}
                  eventKey={category}
                  childFunctions={{
                    getPosts,
                  }}
                />
              );
            })
          : ''}
      </Tab>
    );
  });

  return (
    <Container
      className={`body ${theme} home-page-container`}
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
            id='home-page-top-panel'
            className='d-flex flex-row justify-content-around align-items-center'
          >
            <Form className='d-flex flex-row justify-content-center align-items-center'>
              <Form.Label className='mb-0 mx-2'>Sort posts: </Form.Label>
              <Form.Check
                className='mb-0 mx-2'
                type='radio'
                name='Sort'
                label='Newest'
                onChange={() => handleOrderSelect('createdAt')}
                checked={order === 'createdAt'}
              />
              <Form.Check
                className='mb-0 mx-2'
                type='radio'
                name='Sort'
                label='Upvotes'
                onChange={() => handleOrderSelect('upvotes')}
                checked={order === 'upvotes'}
              />
            </Form>
            {/* <div
              id='create-post-form'
              className='d-none d-xl-flex d-xxl-flex w-50'
            >
              <CreateContentForm />
            </div> */}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className='home-page-tabs'>
            <Tabs activeKey={key} onSelect={(key) => handleTabSelect(key)}>
              {tabComponents}
            </Tabs>
          </div>
        </Col>
      </Row>

      {/* <Row>
        <div className='page-bottom-panel' id='create-post-form'>
          <CreateContentForm />
        </div>
      </Row> */}
    </Container>
  );
};

export default HomePage;
