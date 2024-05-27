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
import { ThemeContext, RunModeContext, UserContext } from './Context';

import CreateFriend from './CreateFriend';
import { PostCard } from './PostCard';
import { Post, FriendRequest, User } from '../types';
import FriendManager from './FriendManager';
import FriendRequestCard from './FriendRequestCard';
import FriendCard from './FriendCard';

interface FeedPageProps {
  userId: number;
  setConfirmActionBundle: any;
  setShareModalBundle: any;
}

const FeedPage: React.FC<FeedPageProps> = ({
  userId,
  setConfirmActionBundle,
  setShareModalBundle,
}) => {
  const [sharedPosts, setSharedPosts] = useState<Post[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendsPosts, setFriendsPosts] = useState<Post[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  const [key, setKey] = useState<string>('shared');

  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const {user,friends, votes} = useContext(UserContext);

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

  // After shared posts are fetched (see useEffect above), then for each post fetch who shared it with user and the posts content
  /*
  useEffect(() => {
    // fetch details for a post, will run this on all posts shared with user
    const fetchDetails = async (postId: number, type: string) => {
      try {
        const response = await axios.get(`/api/feed/shared-${type}/${postId}`);

        // Checking if the post has been deleted since being originally loaded.
        if (response.data === null) {
          if (type === 'comment') {
            setCommentDetails((prevDetails) => ({
              ...prevDetails,
              [postId]: null,
            }));
            // } else if (type === "pin") {
            //   setPinDetails((prevDetails) => ({
            //     ...prevDetails,
            //     [postId]: null,
            //   }));
          } else if (type === 'photo') {
            setPhotoDetails((prevDetails) => ({
              ...prevDetails,
              [postId]: null,
            }));
          }
          {
            toast.error('Post deleted due to too many downvotes!');
          }
          setTimeout(() => {
            window.location.reload();
          }, 5000);

          return;
        }

        const details = {
          comment: {
            id: response.data.id,
            comment: response.data.comment,
            ownerId: response.data.ownerId,
            upvotes: response.data.upvotes,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          },
          // pin: {
          //   ownerId: response.data.ownerId,
          //   isToilet: response.data.isToilet,
          //   isFood: response.data.isFood,
          //   isPersonal: response.data.isPersonal,
          //   upvotes: response.data.upvotes,
          // },
          photo: {
            id: response.data.id,
            description: response.data.description,
            ownerId: response.data.ownerId,
            upvotes: response.data.upvotes,
            photoUrl: response.data.photoURL,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          },
        };

        // adding each posts details to objects in state to keep track of posts on this page
        if (type === 'comment') {
          setCommentDetails((prevDetails) => ({
            ...prevDetails,
            [postId]: details.comment,
          }));
          // } else if (type === "pin") {
          //   setPinDetails((prevDetails) => ({
          //     ...prevDetails,
          //     [postId]: details.pin,
          //   }));
        } else if (type === 'photo') {
          setPhotoDetails((prevDetails) => ({
            ...prevDetails,
            [postId]: details.photo,
          }));
        }

        // Fetch sharing user first name & last name if not already fetched
        if (!userNames[response.data.ownerId]) {
          const userResponse = await axios.get(
            `/api/feed/user/${response.data.ownerId}`
          );
          setUserNames((prevNames) => ({
            ...prevNames,
            [response.data
              .ownerId]: `${userResponse.data.firstName} ${userResponse.data.lastName}`,
          }));
        }
      } catch (error) {
        console.error(`Error fetching ${type} details:`, error);
      }
    };

    // this function aggs all async requests for comment and photo content and sharer's name into one promiseAll
    const fetchDataDetails = async () => {
      const fetchPromises: Promise<void>[] = [];

      sharedPosts.forEach((post) => {
        if (post.sender_userId && !userNames[post.sender_userId]) {
          fetchPromises.push(fetchSenderName(post.sender_userId));
        }

        if (post.shared_commentId) {
          fetchPromises.push(fetchDetails(post.shared_commentId, 'comment'));
        }

        // if (post.shared_pinId) {
        //   fetchPromises.push(fetchDetails(post.shared_pinId, "pin"));
        // }

        if (post.shared_photoId) {
          fetchPromises.push(fetchDetails(post.shared_photoId, 'photo'));
        }
      });

      try {
        await Promise.all(fetchPromises);
      } catch (error) {
        console.error(`Error in Promise.all:`, error);
      }
    };

    fetchDataDetails();
  }, [sharedPosts, userNames]);
  */

  /*
  NEXT THREE FUNCTIONS NOT USED FROM FEED PAGE; UPVOTING/DOWNVOTING TAKES PLACE IN POST-CARD

  const handleUpvote = async (postId: number, type: string) => {
    if (isDemoMode) {
      toast('🎭Upvote post!🎭', {
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
        await axios.post(
          `/api/feed/${
            type === 'comment'
              ? `upvote-comment/${userId}/${postId}`
              : type === 'pin'
              ? `upvote-pin/${userId}/${postId}`
              : `upvote-photo/${userId}/${postId}`
          }`
        );

        // Update the voting status based on the type
        if (type === 'comment') {
          setCommentVotingStatus((prev) => ({ ...prev, [postId]: 'upvoted' }));
        } else if (type === 'pin') {
          setPinVotingStatus((prev) => ({ ...prev, [postId]: 'upvoted' }));
        } else if (type === 'photo') {
          setPhotoVotingStatus((prev) => ({ ...prev, [postId]: 'upvoted' }));
        }

        // Fetch updated post details
        await fetchPostDetails(postId, type);

        // Update the state using functional updates
        setSharedPosts((prevSharedPosts) =>
          prevSharedPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  upvotes: post.upvotes + 1,
                }
              : post
          )
        );
      } catch (error) {
        toast.warning("You've already upvoted this post!");
      }
    }
  };


  const handleDownvote = async (postId: number, type: string) => {
    if (isDemoMode) {
      toast('Downvote post!🎭', {
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
        await axios.post(
          `/api/feed/${
            type === 'comment'
              ? `downvote-comment/${userId}/${postId}`
              : type === 'pin'
              ? `downvote-pin/${userId}/${postId}`
              : `downvote-photo/${userId}/${postId}`
          }`
        );

        // Update the voting status based on the type
        if (type === 'comment') {
          setCommentVotingStatus((prev) => ({
            ...prev,
            [postId]: 'downvoted',
          }));
        } else if (type === 'pin') {
          setPinVotingStatus((prev) => ({ ...prev, [postId]: 'downvoted' }));
        } else if (type === 'photo') {
          setPhotoVotingStatus((prev) => ({ ...prev, [postId]: 'downvoted' }));
        }

        // Fetch updated post details
        await fetchPostDetails(postId, type);

        // Update the state using functional updates
        setSharedPosts((prevSharedPosts) =>
          prevSharedPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  upvotes: post.upvotes - 1,
                }
              : post
          )
        );

        // Check if the post has reached -5 upvotes
        const updatedUpvotes = sharedPosts
          .map((post) =>
            post.id === postId ? { ...post, upvotes: post.upvotes - 1 } : post
          )
          .find((post) => post.id === postId)?.upvotes;

        if (updatedUpvotes === -5) {
          setDeletedPosts((prevDeletedPosts) => [...prevDeletedPosts, postId]);
          // Show deletion toast
          toast.error(`Post deleted due to too many downvotes: ID ${postId}`);
          // Delay the page refresh by 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        toast.warning("You've already downvoted this post!");
      }
    }
  };


  const fetchPostDetails = async (postId: number, type: string) => {
    try {
      if (!sharedPosts.some((post) => post.id === postId)) {
        return;
      }

      if (type === 'comment') {
        const response = await axios.get(`/api/feed/shared-comment/${postId}`);

        if (response.data !== null) {
          setCommentDetails((prevDetails) => ({
            ...prevDetails,
            [postId]: {
              id: response.data.id,
              comment: response.data.comment,
              ownerId: response.data.ownerId,
              upvotes: response.data.upvotes,
              createdAt: response.data.createdAt,
              updatedAt: response.data.updatedAt,
            },
          }));
        } else {
          console.error(`Error: Comment with ID ${postId} not found.`);
        }
        // } else if (type === "pin") {
        //   const response = await axios.get(`/api/feed/shared-pin/${postId}`);
        //   setPinDetails((prevDetails) => ({
        //     ...prevDetails,
        //     [postId]: {
        //       ownerId: null,
        //       isToilet: null,
        //       isFood: null,
        //       isPersonal: null,
        //       upvotes: null,
        //     },
        //   }));
      } else if (type === 'photo') {
        const response = await axios.get(`/api/feed/shared-photo/${postId}`);
        setPhotoDetails((prevDetails) => ({
          ...prevDetails,
          [postId]: {
            id: response.data.id,
            description: response.data.description,
            ownerId: response.data.ownerId,
            upvotes: response.data.upvotes,
            photoUrl: response.data.photoUrl,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          },
        }));
      }
    } catch (error) {
      console.error(
        `Error fetching updated details for ${type} with ID ${postId}:`,
        error
      );
    }
  };
  */

  // TODO: handleArchive **
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

  console.log('inside feed. UserContextInfo: ', user, friends, votes);
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
                      setShareModalBundle={setShareModalBundle}
                      setConfirmActionBundle={setConfirmActionBundle}
                      childFunctions={{
                        handleRemovePostFromFeed: () =>
                          handleRemovePostFromFeed(post.content.id),
                      }}
                    />
                  );
                })}
              </Tab>
              <Tab eventKey={'friends'} title={'Friends'}>
                <FriendManager />
                {/* <Accordion>
                  <Accordion.Item eventKey='0'>
                  <Accordion.Header>Friends</Accordion.Header>
                    <Accordion.Body>
                      {
                        friends.map((friend: User, index)=>{
                          return (<FriendCard key={`${index}-${friend.id}`} friend={friend} />)
                        })
                      }

                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey='1'>
                    <Accordion.Header>Pending Requests</Accordion.Header>
                    <Accordion.Body>

                      {friendRequests.map(
                        (friendRequest: FriendRequest, index: number) => {
                          return (
                            <FriendRequestCard
                              key={`${index}-${friendRequest.id}`}
                              friendRequest={friendRequest}
                            />
                          );
                        }
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey='2'>
                    <Accordion.Header>Add a Friend</Accordion.Header>
                    <Accordion.Body>
                      <CreateFriend />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion> */}

                {/* FRIENDS CONTENT */}
                {friendsPosts.map((post, index) => {
                  return (
                    <PostCard
                      key={`${post.content.id} + ${index}`}
                      post={post}
                      userId={userId}
                      setShareModalBundle={setShareModalBundle}
                      setConfirmActionBundle={setConfirmActionBundle}
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
                      setShareModalBundle={setShareModalBundle}
                      setConfirmActionBundle={setConfirmActionBundle}
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

/* PREVIOUS STYLING FOR FEED PAGE CARDS

<ul style={{ padding: 0, listStyle: 'none' }}>
  {Array.isArray(sharedPosts) && sharedPosts.length > 0 ? (
    sharedPosts.map((post) => (
      <li key={post.id}>
        <div className='post-card'>
          <div style={{ display: 'flex', alignItems: 'right' }}>
            <p
              style={{
                marginLeft: 'auto',
                lineHeight: '.5',
                fontSize: '1rem',
              }}
            >
              {userNames[post.sender_userId]} sent you
            </p>
          </div>

          {post.shared_commentId && (
            <div style={{ marginTop: '5px' }}>

              {commentDetails[post.shared_commentId] ? (
                <Card.Body>
                  <Card.Text as='div'>
                    <p className='card-content'>
                      {commentDetails[post.shared_commentId].comment}
                    </p>

                    <p className='card-detail'>
                      {
                        userNames[
                          commentDetails[post.shared_commentId].ownerId
                        ]
                      }{' '}
                      posted
                      <br />
                      <>
                        <OverlayTrigger
                          placement='top'
                          overlay={
                            <Tooltip id={`tooltip-${post.id}`}>
                              {dayjs(post.createdAt.toString()).format(
                                'dddd [at] h:mm A'
                              )}
                            </Tooltip>
                          }
                        >
                          <span style={{ cursor: 'pointer' }}>
                            {dayjs(post.createdAt.toString()).fromNow()}
                          </span>
                        </OverlayTrigger>
                      </>
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '-10px',
                      }}
                    >
                      <button
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          outline: 'none',
                          boxShadow: 'none',
                          background: 'transparent',
                        }}
                        onClick={() => {
                          handleUpvote(post.shared_commentId, 'comment');
                        }}
                        disabled={
                          commentVotingStatus[post.shared_commentId] ===
                          'upvoted'
                        }
                      >
                        <IoArrowUpCircle
                          style={{
                            color:
                              commentVotingStatus[
                                post.shared_commentId
                              ] === 'upvoted'
                                ? 'green'
                                : 'black',
                            fontSize: '30px',
                          }}
                        />
                      </button>
                      <div style={{ margin: '0 5px', fontSize: '16px' }}>
                        {commentDetails[post.shared_commentId]?.upvotes}
                      </div>
                      <button
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          outline: 'none',
                          boxShadow: 'none',
                          background: 'transparent',
                        }}
                        onClick={() => {
                          handleDownvote(
                            post.shared_commentId,
                            'comment'
                          );
                        }}
                        disabled={
                          commentVotingStatus[post.shared_commentId] ===
                          'downvoted'
                        }
                      >
                        <IoArrowDownCircle
                          style={{
                            color:
                              commentVotingStatus[
                                post.shared_commentId
                              ] === 'downvoted'
                                ? 'red'
                                : 'black',
                            fontSize: '30px',
                          }}
                        />
                      </button>
                      <Button
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          outline: 'none',
                          boxShadow: 'none',
                          background: 'transparent',
                          marginLeft: 'auto',
                        }}
                        onClick={() => handleShowDeleteModal(post.id)}
                      >
                        <BiHide />
                      </Button>
                    </div>
                  </Card.Text>
                </Card.Body>
              ) : (
                post.upvotes <= -5 && (
                  <div>
                    {toast.error(
                      'Post deleted due to too many downvotes!'
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {post.shared_photoId && (
            <div style={{ marginTop: '5px' }}>
              {photoDetails[post.shared_photoId] ? (
                <Card.Body>
                  <Card.Text as='div'>
                    <div>
                      <img
                        src={photoDetails[post.shared_photoId].photoUrl}
                        alt='Shared Photo'
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          marginTop: '10px',
                        }}
                      />

                      <p className='card-content'>
                        {photoDetails[post.shared_photoId].description}
                      </p>

                      <p className='card-detail'>
                        {
                          userNames[
                            photoDetails[post.shared_photoId].ownerId
                          ]
                        }{' '}
                        posted
                        <br />
                        <>
                          <OverlayTrigger
                            placement='top'
                            overlay={
                              <Tooltip id={`tooltip-${post.id}`}>
                                {dayjs(post.createdAt.toString()).format(
                                  'dddd [at] h:mm A'
                                )}
                              </Tooltip>
                            }
                          >
                            <span style={{ cursor: 'pointer' }}>
                              {dayjs(post.createdAt.toString()).fromNow()}
                            </span>
                          </OverlayTrigger>
                        </>
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '-10px',
                        }}
                      >
                        <button
                          style={{
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: 'none',
                            background: 'transparent',
                          }}
                          onClick={() => {
                            handleUpvote(post.shared_photoId, 'photo');
                          }}
                          disabled={
                            photoVotingStatus[post.shared_photoId] ===
                            'upvoted'
                          }
                        >
                          <IoArrowUpCircle
                            style={{
                              color:
                                photoVotingStatus[post.shared_photoId] ===
                                'upvoted'
                                  ? 'green'
                                  : 'black',
                              fontSize: '30px',
                            }}
                          />
                        </button>
                        <span
                          style={{ margin: '0 5px', fontSize: '16px' }}
                        >
                          {photoDetails[post.shared_photoId]?.upvotes}
                        </span>
                        <button
                          style={{
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: 'none',
                            background: 'transparent',
                          }}
                          onClick={() => {
                            handleDownvote(post.shared_photoId, 'photo');
                          }}
                          disabled={
                            photoVotingStatus[post.shared_photoId] ===
                            'downvoted'
                          }
                        >
                          <IoArrowDownCircle
                            style={{
                              color:
                                photoVotingStatus[post.shared_photoId] ===
                                'downvoted'
                                  ? 'red'
                                  : 'black',
                              fontSize: '30px',
                            }}
                          />
                        </button>
                        <Button
                          style={{
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: 'none',
                            background: 'transparent',
                            marginLeft: 'auto',
                          }}
                          onClick={() => handleShowDeleteModal(post.id)}
                        >
                          <BiHide />
                        </Button>
                      </div>
                    </div>
                  </Card.Text>
                </Card.Body>
              ) : null}
            </div>
          )}
        </div>
      </li>
    ))
  ) : (
    <p>No shared posts available.</p>
  )}
</ul>

//styling for pins

  /* {post.shared_pinId && (
  <div style={{ marginTop: "5px" }}>
    <p style={{ margin: 0 }}>
      Shared Pin ID: {post.shared_pinId}
    </p>
    {pinDetails[post.shared_pinId] ? (
      <div>
        <p style={{ margin: 0 }}>
          Is Toilet:{" "}
          {pinDetails[post.shared_pinId].isToilet
            ? "Yes"
            : "No"}
        </p>
        <p style={{ margin: 0 }}>
          Is Food:{" "}
          {pinDetails[post.shared_pinId].isFood ? "Yes" : "No"}
        </p>
        <p style={{ margin: 0 }}>
          Is Personal:{" "}
          {pinDetails[post.shared_pinId].isPersonal
            ? "Yes"
            : "No"}
        </p>
        <p style={{ margin: 0 }}>
          Creator:{" "}
          {userNames[pinDetails[post.shared_pinId].ownerId]}
        </p>
        <p style={{ margin: 0 }}>
          Created At:{" "}
          {dayjs(post.createdAt).format("MM/D/YY, h:mm:ss A")}
        </p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              border: "none",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
              background: "transparent",
            }}
            onClick={() => {
              handleUpvote(post.shared_pinId, "pin");
            }}
            disabled={
              pinVotingStatus[post.shared_pinId] === "upvoted"
            }
          >
            <IoArrowUpCircle
              style={{
                color:
                  pinVotingStatus[post.shared_pinId] ===
                  "upvoted"
                    ? "green"
                    : "black",
                fontSize: "30px",
              }}
            />
          </button>
          <span style={{ margin: "0 5px" }}>
            {pinDetails[post.shared_pinId]?.upvotes}
          </span>
          <button
            style={{
              border: "none",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
              background: "transparent",
            }}
            onClick={() => {
              handleDownvote(post.shared_pinId, "pin");
            }}
            disabled={
              pinVotingStatus[post.shared_pinId] === "downvoted"
            }
          >
            <IoArrowDownCircle
              style={{
                color:
                  pinVotingStatus[post.shared_pinId] ===
                  "downvoted"
                    ? "red"
                    : "black",
                fontSize: "30px",
              }}
            />
          </button>
          <button
            style={{
              border: "none",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
              background: "transparent",
              marginLeft: "auto",
            }}
            onClick={() => handleRemovePostFromFeed(post.id)}
          >
            <BsTrash
              style={{
                color: "gold",
                fontSize: "30px",
                border: "1px solid black",
                borderRadius: "50%",
                padding: "5px",
              }}
            />
          </button>
        </div>
      </div>
    ) : null}
  </div>
)}
}
*/
