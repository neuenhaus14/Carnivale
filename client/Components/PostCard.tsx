import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaShareSquare } from '@react-icons/all-files/fa/FaShareSquare';
import { MdDelete } from '@react-icons/all-files/md/MdDelete';
import { BiHide } from '@react-icons/all-files/bi/BiHide';

// import ShareModal from './ShareModal';
// import {IoMdArrowUp} from "@react-icons/all-files/io/IoMdArrowUp";
// import {IoMdArrowDown} from "@react-icons/all-files/io/IoMdArrowDown";

import { IoArrowDownCircle } from '@react-icons/all-files/io5/IoArrowDownCircle';
import { IoArrowUpCircle } from '@react-icons/all-files/io5/IoArrowUpCircle';
import { RunModeContext } from './Context';

dayjs.extend(relativeTime);

/*
A post is whatever goes into a PostCard. RN it is a record from the 'comments' or 'photos' tables in the DB, excluding the type of content it is (eg, isPin, isCostume, isThrow), plus optional extras for shared posts (senderName, remove). The posts are fetched server-side according to those content type filters, with the request for the content type stipulated by client-side state (ie, when the costume tab is selected, go get costumes). Once we have content client side we don't need to know what kind they are RN (maybe eventually; should also refactor for enums in database tables), so those filtering booleans don't make it into the interface.
*/
export interface Post {
  id: number;
  ownerId: number;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;

  /*
  photos have 'description' and 'photoURL', comments have 'comment'
  */
  comment?: string;
  photoURL?: string;
  description?: string;

  /*
  for feed page posts, which have a sender
  */
  senderName?: string;
}

interface PostCardProps {
  post: Post;
  userId: number;
  /* getPosts will be different depending on what page we're fetching posts from. On home page, we get all posts and then sort them according to the tab (key) that's active. On feed page, only those shared with user are fetched. This is used to reload posts after upvotes/downvotes -- which doesn't seem SUPER necessary */
  getPosts: any;
  /* Order is not being used */
  order?: string;
  /* used to fetch specific content on home page because of content tabs (gos, costumes, throws), not used on feed page rn */
  eventKey?: string;
  /* 2 share modal functions: only on home page rn */
  setPostToShare: any;
  setShowShareModal: any;

  /*
  to hook confirmActionModal into PostCard. setConfirmActionBundle comes from App. confirmFunctions are an object of functions passed from a page into its postCards that will be passed up to App that will run after a confirmation is made (eg, removing a shared post from a feed).
  */
  setConfirmActionBundle?: any;
  confirmFunctions?: any;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  userId,
  getPosts,
  order,
  eventKey,
  setPostToShare,
  setShowShareModal,
  setConfirmActionBundle,
  confirmFunctions,
}) => {
  // THE UPVOTE/DOWNVOTE FUNCTIONALITY WORKS BUT THE COLORING OF THE VOTE BUTTONS DOES NOT WORK -- AFTER UPVOTING/DOWNVOTING, WE GET THE POSTS IN A FINALLY BLOCK, RELOADING EVERYTHING, SO ALL POSTS' commentVotingStatus ARE RESET TO 'NONE'. DOES IT MAKE SENSE TO RELOAD AFTER EVERY UPVOTE OR DOWNVOTE? THE CONTENT MOVES AROUND AFTER DOING SO PROVIDED NEW VOTE COUNT.

  const [owner, setOwner] = useState('');

  const [commentVotingStatus, setCommentVotingStatus] = useState<
    'upvoted' | 'downvoted' | 'none'
  >('none');

  const [isOwner, setIsOwner] = useState(false);
  const isDemoMode = useContext(RunModeContext) === 'demo';

  // posts that are text-only have comments. Photo's have descriptions
  const postType = post.photoURL ? 'photo' : 'comment';
  const postText = postType === 'photo' ? post.description : post.comment;
  const isSharedPost = post.senderName ? true : false;

  const [imgDimensions, setImgDimensions] = useState({
    width: null,
    height: null,
  });

  const getOwner = async () => {
    try {
      const { data } = await axios.get(`api/home/post/${post.ownerId}`);
      setOwner(data.firstName + ' ' + data.lastName);
      setIsOwner(data.id === userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async () => {
    // if demo mode, display toast
    if (isDemoMode) {
      toast('🎭 Post upvoted! 🎭', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    // else run upvote logic
    else {
      try {
        await axios.post(`/api/feed/upvote-${postType}/${userId}/${post.id}`);
        if (commentVotingStatus !== 'upvoted') {
          setCommentVotingStatus('upvoted');
        }
      } catch (err) {
        toast.warning("You've already upvoted this post!");
      } finally {
        getPosts(eventKey);
      }
    }
  };

  const handleDownvote = async () => {
    // if demo mode, display toast
    if (isDemoMode) {
      toast('🎭 Post downvoted! 🎭', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    // if not demo mode, run downvote logic
    else {
      try {
        await axios.post(`/api/feed/downvote-${postType}/${userId}/${post.id}`);

        if (commentVotingStatus !== 'downvoted') {
          setCommentVotingStatus('downvoted');

          if (post.upvotes - 1 <= -5) {
            toast.error('Post deleted due to too many downvotes!');
          }
        }
      } catch (err) {
        toast.warning("You've already downvoted this post!");
      } finally {
        getPosts(eventKey);
      }
    }
  };

  const configurePhotoPost = () => {
    // load image into the browser before
    // rendering the image, so as to orient the
    // card properly
    const postImg = new Image();
    postImg.src = post.photoURL;
    postImg.onload = async () => {
      await setImgDimensions({
        height: postImg.height,
        width: postImg.width,
      });
    };
  };

  useEffect(() => {
    if (postType === 'photo') {
      configurePhotoPost();
    }
    getOwner();
  }, []);

  const handleDeletePost = async () => {
    if (isDemoMode) {
      toast.success('Delete your post!');
    } else {
      try {
        if (isOwner) {
          await axios.delete(`/api/home/delete-${postType}/${post.id}`, {
            data: { userId },
          });
          toast.success('Post deleted successfully!');
        } else {
          toast.error(
            'You are not the owner of this post. Delete not allowed.'
          );
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Error deleting post. Please try again.');
      } finally {
        getPosts(eventKey);
      }
    }
  };

  const handleInitPostShare = () => {
    setPostToShare({
      id: post.id,
      type: postType,
    });
    setShowShareModal(true);
  };

  const createClassName = () => {
    let className = `post-card ${postType}-post-card`;

    if (postType === 'photo') {
      if (imgDimensions.height >= imgDimensions.width) {
        className += ' portrait-photo-post-card';
      } else {
        className += ' landscape-photo-post-card';
      }
    }
    return className;
  };

  return (
    <>
      <Card className={createClassName()}>
        {postType === 'photo' && (
          <>
            <Card.Img className='post-card-image' src={post.photoURL} />
          </>
        )}
        <Card.Body className='post-card-body'>
          <Card.Text className='post-card-text' as='div'>
            {isSharedPost && (
              <div className='post-card-sender'>via {post.senderName}</div>
            )}
            <div className='post-card-content'>{postText}</div>
            <div className='post-card-detail'>
              <div className='post-card-user-name'>{owner}</div>
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
                  <div
                    className='post-card-created-at-text'
                    style={{ cursor: 'pointer' }}
                  >
                    {dayjs(post.createdAt.toString()).fromNow()}
                  </div>
                </OverlayTrigger>
              </>
            </div>
          </Card.Text>
          <div className='post-card-buttons mt-3'>
            <div className='vote-buttons-container d-flex flex-row align-items-center'>
              <Button
                variant='outline-success'
                className='vote-button rounded-circle'
                onClick={() => handleUpvote()}
                disabled={commentVotingStatus === 'upvoted'}
              >
                <IoArrowUpCircle
                  style={{
                    color:
                      commentVotingStatus === 'upvoted' ? 'green' : 'black',
                    fontSize: '25px',
                  }}
                />
              </Button>
              <span className='mx-2'>{post.upvotes}</span>
              <Button
                variant='outline-danger'
                className='vote-button rounded-circle'
                onClick={() => handleDownvote()}
                disabled={commentVotingStatus === 'downvoted'}
              >
                <IoArrowDownCircle
                  style={{
                    color:
                      commentVotingStatus === 'downvoted' ? 'red' : 'black',
                    fontSize: '25px',
                  }}
                />
              </Button>
            </div>
            <div className='share-delete-buttons-container d-flex flex-row'>
              {/* TODO: add remove share functionality through the ConfirmActionModal */}
              {isSharedPost && (
                <Button
                  className='post-card-remove-shared-post-button'
                  variant='secondary'
                  onClick={async () => {
                    await setConfirmActionBundle.setConfirmActionFunction(
                      () => async () => {
                        await confirmFunctions.handleDelete();
                      }
                    );
                    await setConfirmActionBundle.setConfirmActionText(
                      'remove the post form your feed.'
                    );
                    await setConfirmActionBundle.setShowConfirmActionModal(
                      true
                    );
                  }}
                >
                  <BiHide />
                </Button>
              )}

              {isOwner && (
                <Button
                  className='post-card-delete-button'
                  variant='danger'
                  onClick={() => handleDeletePost()}
                >
                  <MdDelete />
                </Button>
              )}
              <Button
                variant='info'
                className='post-card-share-button'
                onClick={handleInitPostShare}
              >
                <FaShareSquare />
              </Button>
            </div>
          </div>
        </Card.Body>

        {/* <Card.Body className='post-card-photo'>
            <Card.Img
              className='post-card-image'
              variant='top'
              src={post.photoURL}
            />
            <Card.Text as='div'>
              <div className='card-content'>{post.description}</div>
              <div className='card-detail'>
                {owner} posted{' '}
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
              </div>
            </Card.Text>
            <div className='post-card-buttons'>
              <div>
                <Button
                  className='vote-button rounded-circle'
                  size='sm'
                  onClick={() => handleUpvote('photo')}
                  disabled={commentVotingStatus === 'upvoted'}
                >
                  <IoArrowUpCircle
                    style={{
                      color:
                        commentVotingStatus === 'upvoted' ? 'green' : 'black',
                      fontSize: '30px',
                    }}
                  />
                </Button>
                <span className='mx-2'>{post.upvotes}</span>
                <Button
                  className='vote-button rounded-circle'
                  size='sm'
                  onClick={() => handleDownvote('photo')}
                  disabled={commentVotingStatus === 'downvoted'}
                >
                  <IoArrowDownCircle
                    style={{
                      color:
                        commentVotingStatus === 'downvoted' ? 'red' : 'black',
                      fontSize: '30px',
                    }}
                  />
                </Button>
              </div>
              <div>
                {isOwner && (
                  <Button
                    className='m-1'
                    variant='danger'
                    onClick={() =>
                      handleDeletePost(post.comment ? 'comment' : 'photo')
                    }
                  >
                    Delete
                  </Button>
                )}

                <Button className='m-1' onClick={handleInitPostShare}>
                  <FaShareSquare />
                </Button>
              </div>
            </div>
          </Card.Body> */}
      </Card>

      {/* Toast containers */}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme='light'
      />
    </>
  );
};

export { PostCard };
