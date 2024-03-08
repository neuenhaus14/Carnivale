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

// import ShareModal from './ShareModal';
// import {IoMdArrowUp} from "@react-icons/all-files/io/IoMdArrowUp";
// import {IoMdArrowDown} from "@react-icons/all-files/io/IoMdArrowDown";
import { IoArrowDownCircle } from '@react-icons/all-files/io5/IoArrowDownCircle';
import { IoArrowUpCircle } from '@react-icons/all-files/io5/IoArrowUpCircle';
import { RunModeContext } from './Context';

dayjs.extend(relativeTime);

interface Post {
  id: number;
  comment?: string;
  ownerId: number;
  photoURL?: string;
  description?: string;
  createdAt: string;
  upvotes: number;
}

interface PostCardProps {
  post: Post;
  userId: number;
  getPosts: any;
  order: string;
  eventKey: string;
  setPostToShare: any;
  setShowShareModal: any;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  userId,
  getPosts,
  order,
  eventKey,
  setPostToShare,
  setShowShareModal,
}) => {
  const [owner, setOwner] = useState('');
  const [commentVotingStatus, setCommentVotingStatus] = useState<
    'upvoted' | 'downvoted' | 'none'
  >('none');
  const [isOwner, setIsOwner] = useState(false);
  const isDemoMode = useContext(RunModeContext) === 'demo';

  const getOwner = async () => {
    try {
      const { data } = await axios.get(`api/home/post/${post.ownerId}`);
      setOwner(data.firstName + ' ' + data.lastName);
      setIsOwner(data.id === userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (type: string) => {
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
        await axios.post(
          `/api/feed/${
            type === 'comment'
              ? `upvote-comment/${userId}/${post.id}`
              : `upvote-photo/${userId}/${post.id}`
          }`
        );
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

  const handleDownvote = async (type: string) => {
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
        await axios.post(
          `/api/feed/${
            type === 'comment'
              ? `downvote-comment/${userId}/${post.id}`
              : `downvote-photo/${userId}/${post.id}`
          }`
        );

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

  useEffect(() => {
    getOwner();
  }, []);

  const handleDeletePost = async (type: string) => {
    if (isDemoMode) {
      toast.success('Delete your post!');
    } else {
      try {
        if (isOwner) {
          await axios.delete(
            `/api/home/${
              type === 'comment'
                ? `delete-comment/${post.id}`
                : `delete-photo/${post.id}`
            }`,
            { data: { userId } }
          );

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

  const postType = post.photoURL ? 'photo' : 'comment';

  const postText = postType === 'photo' ? post.description : post.comment;

  const handleInitPostShare = () => {
    setPostToShare({
      id: post.id,
      type: postType,
    });
    setShowShareModal(true);
  };

  // posts that are text only have comments. Photo's have descriptions

  return (
    <>
      <Card className={`post-card post-card-${postType}`}>
        {postType === 'photo' && (
          <Card.Img
            className='post-card-image'
            src={post.photoURL}
          />
        )}
        {post.comment ? (
          <Card.Body>
            <Card.Text as='div'>
              <div className='card-content'>{post.comment}</div>
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
                {/* {dayjs(post.createdAt.toString()).fromNow()} */}
              </div>
            </Card.Text>
            <div className='post-card-buttons'>
              <div>
                <Button
                  className='vote-button rounded-circle'
                  size='sm'
                  onClick={() => handleUpvote('comment')}
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
                  onClick={() => handleDownvote('comment')}
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
          </Card.Body>
        ) : (
          <Card.Body className='post-card-photo'>
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
                  {/* {' '} */}
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
          </Card.Body>
        )}
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

export default PostCard;
