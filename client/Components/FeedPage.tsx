import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Container,
  Modal,
  Row,
  Col,
  Tabs,
  Tab,
  Accordion,
} from 'react-bootstrap';
import { ThemeContext, RunModeContext, UserContext, ContentFunctionsContext } from './Context';

import { PostCard } from './Cards/PostCard';
import { Post, FriendRequest, User } from '../types';

interface FeedPageProps {
  userId: number;
}

const FeedPage: React.FC<FeedPageProps> = ({
  userId,
}) => {
  const [sharedPosts, setSharedPosts] = useState<Post[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendsPosts, setFriendsPosts] = useState<Post[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  const [key, setKey] = useState<string>('shared');

  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const { user, friends, votes, plans } = useContext(UserContext);
  const {setConfirmActionModalBundle, setCreateContentModalBundle, setShareModalBundle} = useContext(ContentFunctionsContext)

  const [showAboutModal, setShowAboutModal] = useState(true);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  const getPosts = async () => {
    try {
      const postsResponse = await axios.get(
        `/api/content/getFeedPageContent/${user.id}`
      );
      setSharedPosts(postsResponse.data.sharedContent);
      setFriendsPosts(postsResponse.data.friendsContent);
      setMyPosts(postsResponse.data.myContent);
      setFriendRequests(postsResponse.data.friendRequests);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (userId !== null) {
      getPosts();
    }
  }, [userId]);


  // TODO: change this to handleArchive **
  const handleRemovePostFromFeed = async (postId: number) => {
    if (isDemoMode) {
      toast('🎭Hide post from your feed!🎭', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      try {
        // TODO: rewrite route to archive in experimental database
        await axios.delete(`/api/feed/shared-posts/${postId}`);
        setSharedPosts((prevPosts) =>
          prevPosts.filter((post) => post.content.id !== postId)
        );
      } catch (error) {
        console.error(`Error deleting post with ID ${postId}:`, error);
      }
    }
  };

  return (
    <Container className={`body ${theme} feed-page-container`}>
      {isDemoMode && (
        <Modal show={showAboutModal} onHide={toggleAboutModal}>
          <Modal.Header closeButton>
            <Modal.Title>DEMO MODE: Feed Page</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='fs-6 lh-sm'>
              <b>Welcome to the Feed page!</b>
              <br />
              <br />
              Here you&apos;ll discover a private feed of content sent directly
              to you from your friends. This content can be upvoted, downvoted
              or removed from your private feed altogether.
              <br />
              <br />
              Take the{' '}
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
          <div className='feed-page-tabs my-3'>
            <Tabs activeKey={key} onSelect={(key) => setKey(key)}>
              <Tab eventKey='shared' title='Shared'>
                {sharedPosts.map((post, index) => {
                  return (
                    <PostCard
                      key={`${post.content.id} + ${index}`}
                      post={post}
                      userId={userId}
                      childFunctions={{
                        handleRemovePostFromFeed: () =>
                          handleRemovePostFromFeed(post.content.id),
                      }}
                    />
                  );
                })}
              </Tab>
              <Tab eventKey={'friends'} title={'Friends'}>
                {/* FRIENDS CONTENT */}
                {friendsPosts.map((post, index) => {
                  return (
                    <PostCard
                      key={`${post.content.id} + ${index}`}
                      post={post}
                      userId={userId}
                      childFunctions={{}}
                    />
                  );
                })}
              </Tab>
              <Tab eventKey={'mine'} title={'Mine'}>
                {myPosts.map((post, index) => {
                  return (
                    <PostCard
                      key={`${post.content.id} + ${index}`}
                      post={post}
                      userId={userId}
                      childFunctions={{}}
                    />
                  );
                })}
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>

      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </Container>
  );
};

export default FeedPage;
