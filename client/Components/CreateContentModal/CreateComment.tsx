import { FaCommentDots } from '@react-icons/all-files/fa/FaCommentDots';
import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Accordion } from 'react-bootstrap';
import { ThemeContext, RunModeContext, UserContext } from '../Context';

import { Comment, Post } from '../../types';
import CreateContentOptions from './CreateContentOptions';

interface CreateCommentProps {
  parentPost: null | Post;
  postToEdit: null | Post;
  lat: number;
  lng: number;
  submitContent: any;
}

const CreateComment: React.FC<CreateCommentProps> = ({
  parentPost,
  lat,
  lng,
  postToEdit,
  submitContent,
}) => {
  // COMMENT-SPECIFIC STATE
  const [comment, setComment] = useState<Comment>({
    id: null,
    description: '',
    createdAt: '',
    updatedAt: '',
  });

  // CONTENT STATE
  const [isCommentPrivate, setIsCommentPrivate] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]); // just ids here


  // CONTEXTS & INCOMING POST
  const isEditMode =
    postToEdit && postToEdit.content.contentableType === 'comment'
      ? true
      : false;
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const { user, votes, friends } = useContext(UserContext);
  useEffect(() => {
    if (isEditMode) {
      setComment(postToEdit.contentable);
      setIsCommentPrivate(
        postToEdit.content.placement === 'private' ? true : false
      );
    }
  }, []);

  // COMPONENT FUNCTIONALITY
  // prevents hitting enter to send empty comment description
  const handleKeyDown = (e: any) => {
    //if key is enter, prevent default
    if (e.key === 'Enter' && comment.description.length > 0) {
      //if comment is valid, submit comment
      e.preventDefault();
      handleCommentSubmit();
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleCommentSubmit = async () => {
    try {
      submitContent('comment', {
        content: {
          latitude: lat,
          longitude: lng,
          userId: user.id,
          parentPost: parentPost,
          placement: isCommentPrivate ? 'private' : 'public',
        },
        description: comment.description,
        tags,
        friendsToShareWith,
      });

    } catch (e) {
      console.error('CLIENT ERROR: failed to create comment', e);
    }
  };

  // TODO: create route on server to update comment record
  const handleCommentUpdate = async () => {
    console.log('handleCommentUpdate executed')
  };

  console.log('comment', comment);
  return (
    <div>
      <Form className='w-100'>
        <Form.Group>
          <div className='d-flex flex-column justify-content-center'>
            {/* COMMENT INPUT */}
            <Form.Control
              className='mt-2'
              placeholder='Ok, Shakespeare, write it here...'
              onChange={(e) =>
                setComment({ ...comment, description: e.target.value })
              }
              value={comment.description}
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
              name='description'
            />

            {/* PLACEMENT SWITCH */}
            <div className='d-flex flex-row align-items-center justify-content-center my-2'>
              <div className='d-flex justify-content-center align-items-center'>
                <p className='mb-0'>Public post</p>
                <Form.Switch
                  id='comment-placement-switch'
                  defaultChecked={isCommentPrivate}
                  onChange={() => setIsCommentPrivate(!isCommentPrivate)}
                />
                <p className='mb-0'>Friends only</p>
              </div>
              {/* CREATE/EDIT COMMENT BUTTON */}
              {isEditMode ? (
                <Button
                  variant='primary'
                  onClick={handleCommentUpdate}
                  disabled={isDemoMode || comment.description.length <= 0}
                  className='mx-4'
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant='primary'
                  onClick={handleCommentSubmit}
                  disabled={isDemoMode || comment.description.length <= 0}
                  className='mx-4'
                >
                  Post It
                </Button>
              )}
            </div>

            <CreateContentOptions
              postToEdit={postToEdit}
              isEditMode={isEditMode}
              setTags={setTags}
              setFriendsToShareWith={setFriendsToShareWith}
              friendsToShareWith={friendsToShareWith}
              tags={tags}
            />
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreateComment;
