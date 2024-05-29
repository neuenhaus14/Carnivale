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
  //toggleShowCreateContentModal: any;
  submitContent: any;
}

const CreateComment: React.FC<CreateCommentProps> = ({
  parentPost,
  lat,
  lng,
  //toggleShowCreateContentModal,
  postToEdit,
  submitContent,
}) => {
  const [comment, setComment] = useState<Comment>({
    id: null,
    description: '',
    createdAt: '',
    updatedAt: '',
  });
  // const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  // just ids here
  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]);

  const [isCommentPrivate, setIsCommentPrivate] = useState<boolean>(false);

  // if we're getting a postToEdit sent in and it's a comment, then we're in edit mode
  const isEditMode =
    postToEdit && postToEdit.content.contentableType === 'comment'
      ? true
      : false;
  const isDemoMode = useContext(RunModeContext) === 'demo';

  const { user, votes, friends } = useContext(UserContext);
  // const tabCategories = process.env.TAB_CATEGORIES.split(' ');

  useEffect(() => {
    if (isEditMode) {
      setComment(postToEdit.contentable);
      setIsCommentPrivate(
        postToEdit.content.placement === 'private' ? true : false
      );
    }
  }, []);

  const handleSubmit = async () => {
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
        tags: tags,
        friendsToShareWith,
      });

    } catch (e) {
      console.error('CLIENT ERROR: failed to create comment', e);
    }
  };

  const handleEdit = async () => {};

  // prevents hitting enter to send empty comments
  const handleKeyDown = (e: any) => {
    //if key is enter, prevent default
    if (e.key === 'Enter' && comment.description.length > 0) {
      //if comment is valid, submit comment
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
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
                  onClick={handleEdit}
                  disabled={isDemoMode || comment.description.length <= 0}
                  className='mx-4'
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant='primary'
                  onClick={handleSubmit}
                  disabled={isDemoMode || comment.description.length <= 0}
                  className='mx-4'
                >
                  Post It
                </Button>
              )}
            </div>

            {/* START OF CCO */}
            <CreateContentOptions
              postToEdit={postToEdit}
              isEditMode={isEditMode}
              setTags={setTags}
              setFriendsToShareWith={setFriendsToShareWith}
              friendsToShareWith={friendsToShareWith}
              tags={tags}
            />

            {/* <Accordion>
              <Accordion.Item eventKey='0'>
                <Accordion.Header>
                  {isEditMode ? 'Tag Options' : 'Tag and Share Options'}
                </Accordion.Header>
                <Accordion.Body>
                  <h5>Add Tags</h5>
                  {/* TAGS FROM CATEGORY TABS
                  <div className='d-flex flex-wrap justify-content-around'>
                    {tabCategories.map((category, index) => {
                      return (
                        <Form.Check
                          type='checkbox'
                          title={`${category}`}
                          label={`${category}`}
                          value={`${category.toLowerCase()}`}
                          key={`${index}-${category}`}
                          onChange={handleCheckedTag}
                        />
                      );
                    })}
                  </div>

                  {/* TAG INPUT

                  <div className='d-flex flex-row'>
                    <Form.Control
                      className='m-2'
                      placeholder='Custom tag goes here'
                      onChange={handleCommentInput}
                      value={tag}
                      name='tag'
                    />
                    <Button
                      className='w-25 my-auto'
                      onClick={addInputTag}
                      disabled={tag.length === 0}
                    >
                      Add
                    </Button>
                  </div>

                  {/* LIST OF TAGS ADDED THRU INPUT
                  {tags
                    .filter((tag) => !tabCategories.includes(tag))
                    .map((tag, index) => {
                      return (
                        <div
                          className='d-flex flex-row align-items-center'
                          key={`${tag}-${index}`}
                        >
                          <p className='mb-0'>{tag}</p>
                          <Button
                            className='btn-sm'
                            variant='danger'
                            name={`${tag}`}
                            onClick={removeTag}
                          >
                            X
                          </Button>
                        </div>
                      );
                    })}

                  {/* SHARE WITH FRIENDS LIST
                  { !isEditMode &&
                    <>
                      <h5>Share with your Friends</h5>
                      <div className='d-flex flex-wrap gap-2'>
                        {friends.map((friend, index) => {
                          return (
                            <Form.Check
                              type='checkbox'
                              title={`${friend.firstName} ${friend.lastName}`}
                              label={`${friend.firstName} ${friend.lastName}`}
                              value={`${friend.id}`}
                              key={`${index}-${friend.firstName}`}
                              onClick={toggleFriendToShareWith}
                            />
                          );
                        })}
                      </div>
                    </>
                  }
                </Accordion.Body>
              </Accordion.Item>
            </Accordion> */}
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreateComment;
