import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaShareSquare } from '@react-icons/all-files/fa/FaShareSquare';
import { MdDelete } from '@react-icons/all-files/md/MdDelete';
import { MdEdit } from '@react-icons/all-files/md/MdEdit';
import { BiHide } from '@react-icons/all-files/bi/BiHide';
import { IoArrowDownCircle } from '@react-icons/all-files/io5/IoArrowDownCircle';
import { IoArrowUpCircle } from '@react-icons/all-files/io5/IoArrowUpCircle';
import { IoMdPin } from '@react-icons/all-files/io/IoMdPin';
import { IoMdCalendar } from '@react-icons/all-files/io/IoMdCalendar';
import { IoMdPhotos } from '@react-icons/all-files/io/IoMdPhotos';
import { IoMdText } from '@react-icons/all-files/io/IoMdText';

import { RunModeContext, ContentFunctionsContext } from '../Context';
import { Post } from '../../types';

dayjs.extend(relativeTime);

/*
A post is whatever goes into a PostCard. RN it is a record from the 'comments' or 'photos' tables in the DB, excluding the type of content it is (eg, isPin, isCostume, isThrow), plus optional extras for shared posts (senderName, remove). The posts are fetched server-side according to those content type filters, with the request for the content type stipulated by client-side state (ie, when the costume tab is selected, go get costumes). Once we have content client side we don't need to know what kind they are RN (maybe eventually; should also refactor for enums in database tables), so those filtering booleans don't make it into the interface.
*/
// export interface Post {
//   content: any;
//   contentable: any;
//   user: any;
//   tags: any;
//   sharedContentDetails?: any;

//   id: number;
//   ownerId: number;
//   createdAt: string;
//   updatedAt?: string;
//   upvotes: number;
//   /*
//   photos have 'description' and 'photoURL', comments have 'comment'
//   */
//   comment?: string;
//   photoURL?: string;
//   description?: string;
//   /*
//   for feed page posts, which have a sender
//   */
//   senderName?: string;
// }

interface PostCardProps {
  post: Post;
  userId: number;
  /* getPosts will be different depending on what page we're fetching posts from. On home page, we get all posts and then sort them according to the tab (key) that's active. On feed page, only those shared with user are fetched. This is used to reload posts after upvotes/downvotes -- which doesn't seem SUPER necessary */
  // getPosts: any;

  /* Order is not being used */
  // order?: string;

  /* used to fetch specific content on home page because of content tabs (gos, costumes, throws), not used on feed page rn TODO: get rid of this? */
  eventKey?: string;

  /*
  childFunctions is an object that contains any functions that get passed from some page into the posts on that page. These include functions passed into the confirm action modal: for instance from the feed page, we'll pass "handleRemovePostFromFeed" (soon to be "archivePost") into each post card that is shared (but won't bother to pass this function through for the home page feed)
  */
  childFunctions?: any;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  userId,
  eventKey,
  childFunctions,
}) => {
  /*
  THE UPVOTE/DOWNVOTE FUNCTIONALITY WORKS BUT THE COLORING OF THE VOTE BUTTONS DOES NOT WORK AFTER RELOAD. ORIGINALLY WE'D getPosts AFTER VOTING, BUT THIS WOULD MOVE THE POST AROUND AFTER VOTING PROVIDED THE NEW ORDER WHEN SORTING BY VOTES, SO THE POST WOULD DISAPPEAR FROM VIEW (WHICH I DON'T THINK WE WANT). THE getPosts FUNCTIONALITY IS COMMENTED OUT IN THE handleVotes FUNCTIONS
*/

  // const [owner, setOwner] = useState('');

  const [commentVotingStatus, setCommentVotingStatus] = useState<
    'upvoted' | 'downvoted' | 'none'
  >('none');

  const [isOwner, setIsOwner] = useState(false);
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const {setConfirmActionModalBundle, setCreateContentModalBundle, setShareModalBundle} = useContext(ContentFunctionsContext)


  // posts that are text-only have comments. Photo's have descriptions
  const postType = post.content.contentableType;
  const postText = post.contentable.description;
  const isSharedPost = post.sharedContentDetails ? true : false;

  const [imgDimensions, setImgDimensions] = useState({
    width: null,
    height: null,
  });

  // const getOwner = async () => {
  //   try {
  //     // const { data } = await axios.get(`api/home/post/${post.user.id}`);
  //     setOwner(data.firstName + ' ' + data.lastName);
  //     setIsOwner(data.id === userId);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // TODO: make work with exp db
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
        await axios.post(
          `/api/feed/upvote-${postType}/${userId}/${post.content.id}`
        );
        if (commentVotingStatus !== 'upvoted') {
          setCommentVotingStatus('upvoted');
        }
      } catch (err) {
        toast.warning("You've already upvoted this post!");
      } finally {
        // Don't getPosts after upvote or downvote
        // childFunctions.getPosts(eventKey);
      }
    }
  };
  // TODO: make work with exp db
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
        await axios.post(
          `/api/feed/downvote-${postType}/${userId}/${post.content.id}`
        );

        if (commentVotingStatus !== 'downvoted') {
          setCommentVotingStatus('downvoted');

          if (post.content.upvotes - 1 <= -5) {
            toast.error('Post deleted due to too many downvotes!');
          }
        }
      } catch (err) {
        toast.warning("You've already downvoted this post!");
      } finally {
        // Don't getPosts after upvote or downvote
        // childFunctions.getPosts(eventKey);
      }
    }
  };

  const configurePhotoPost = () => {
    // load image into the browser before
    // rendering the image, so as to orient the
    // card properly
    const postImg = new Image();
    postImg.src = post.contentable.photoURL;
    postImg.onload = async () => {
      await setImgDimensions({
        height: postImg.height,
        width: postImg.width,
      });
    };
  };

  useEffect(() => {
    if (postType === 'photo' || postType === 'pin') {
      configurePhotoPost();
    }
    setIsOwner(post.user.id === userId);
  }, []);

  // TODO: update this to work with exp. db
  const handleDeletePost = async () => {
    if (isDemoMode) {
      toast.success('Delete your post!');
    } else {
      try {
        if (isOwner) {
          await axios.delete(
            `/api/home/delete-${postType}/${post.content.id}`,
            {
              data: { userId },
            }
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
        childFunctions.getPosts(eventKey);
      }
    }
  };

  const handleInitPostShare = () => {
    setShareModalBundle.setPostToShare({
      id: post.content.id,
      type: postType,
    });
    setShareModalBundle.setShowShareModal(true);
  };

  const createCardClassName = () => {
    let className = `post-card ${postType}-post-card`;

    if (postType === 'photo' || postType === 'pin') {
      if (imgDimensions.height >= imgDimensions.width) {
        className += ' portrait-photo-post-card';
      } else {
        className += ' landscape-photo-post-card';
      }
    }
    return className;
  };

  const iconByContentType = (postType) => {
    switch (postType) {
      case 'pin':
        return <IoMdPin size={'24px'} />;
      case 'photo':
        return <IoMdPhotos size={'24px'} />;
      case 'plan':
        return <IoMdCalendar size={'24px'} />;
      case 'comment':
        return <IoMdText size={'24px'} />;
    }
  };

  return (
    <>
      <Card className={createCardClassName()}>
        {(postType === 'photo' || postType === 'pin') && (
          <>
            <Card.Img
              className='post-card-image'
              src={post.contentable.photoURL}
            />
          </>
        )}
        <Card.Body className='post-card-body'>
          <Card.Text className='post-card-text' as='div'>
            <div className='d-flex flex-row justify-content-between align-content-center'>
              {/* ICON */}
              {iconByContentType(postType)}
              {/* if it's a shared post, who shared it */}
              {isSharedPost && (
                <p className='post-card-sender'>{`shared by ${post.sharedContentDetails.senders.reduce(
                  (acc, cur, index, array) => {
                    if (index === 0) {
                      acc += cur.firstName;
                    } else if (index === array.length - 1) {
                      acc += ` & ${cur.firstName}`;
                    } else {
                      acc += `, ${cur.firstName}`;
                    }
                    return acc;
                  },
                  ''
                )}`}</p>
              )}
              {/* TAGS */}
              {post.tags.length > 0 && (
                <div className='post-card-detail'>
                  {post.tags
                    .map((tagObject) => tagObject.tag)
                    .reduce((acc, cur, index, array) => {
                      if (index === 0) {
                        acc += cur;
                      } else if (index === array.length - 1) {
                        acc += ` & ${cur}`;
                      } else {
                        acc += `, ${cur}`;
                      }
                      return acc;
                    }, '')}
                </div>
              )}
            </div>
            <div className='post-card-content'>{postText}</div>
            <div className='post-card-detail'>
              <div className='post-card-user-name'>{`${post.user.firstName} ${post.user.lastName}`}</div>
              <>
                <OverlayTrigger
                  placement='top'
                  overlay={
                    <Tooltip id={`tooltip-${post.content.id}`}>
                      {dayjs(post.content.createdAt.toString()).format(
                        'dddd [at] h:mm A'
                      )}
                    </Tooltip>
                  }
                >
                  <div
                    className='post-card-created-at-text'
                    style={{ cursor: 'pointer' }}
                  >
                    {dayjs(post.content.createdAt.toString()).fromNow()}
                  </div>
                </OverlayTrigger>
              </>
            </div>
          </Card.Text>
          <div className='post-card-buttons mt-2'>
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
              <span className='mx-2'>{post.content.upvotes}</span>
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
              {isSharedPost && (
                <Button
                  className='post-card-remove-shared-post-button mx-1'
                  variant='danger'
                  onClick={async () => {
                    await setConfirmActionModalBundle.setConfirmActionFunction(
                      () => async () => {
                        await childFunctions.handleRemovePostFromFeed();
                      }
                    );
                    await setConfirmActionModalBundle.setConfirmActionText(
                      'remove the post form your feed.'
                    );
                    await setConfirmActionModalBundle.setShowConfirmActionModal(
                      true
                    );
                  }}
                >
                  <BiHide />
                </Button>
              )}

              {isOwner && (
                <>
                  {/* DELETE POST */}
                  <Button
                    className='post-card-delete-button mx-1'
                    variant='danger'
                    onClick={async () => {
                      await setConfirmActionModalBundle.setConfirmActionFunction(
                        () => async () => {
                          await handleDeletePost();
                        }
                      );
                      await setConfirmActionModalBundle.setConfirmActionText(
                        'delete your post'
                      );
                      await setConfirmActionModalBundle.setShowConfirmActionModal(
                        true
                      );
                    }}
                  >
                    <MdDelete />
                  </Button>
                  {/* EDIT POST */}
                  <Button
                    className='post-card-edit-button mx-1'
                    onClick={() => {
                      setCreateContentModalBundle.setPostToEdit(post);
                      setCreateContentModalBundle.setShowCreateContentModal(
                        true
                      );
                    }}
                  >
                    <MdEdit />
                  </Button>
                </>
              )}
              <Button
                variant='info'
                className='post-card-share-button mx-1'
                onClick={handleInitPostShare}
              >
                <FaShareSquare />
              </Button>
            </div>
          </div>
        </Card.Body>
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
