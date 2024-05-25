import { FaCommentDots } from '@react-icons/all-files/fa/FaCommentDots';
import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ThemeContext, RunModeContext, UserContext } from './Context';
import axios from 'axios';

interface CreateCommentProps {
  placement: 'ad' | 'public' | 'private' | 'system';
  parentContentId: null | number;
  lat: number;
  lng: number;
  toggleShowCreateContentModal: any;
}

const CreateComment: React.FC<CreateCommentProps> = ({
  parentContentId,
  lat,
  lng,
  placement,
  toggleShowCreateContentModal,
}) => {
  const [comment, setComment] = useState('');

  const isDemoMode = useContext(RunModeContext) === 'demo';
  const { user, votes } = useContext(UserContext);

  const handleInput = (e: any) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const createCommentResponse = await axios.post(
        '/api/comment/createComment',
        {
          content: {
            latitude: lat,
            longitude: lng,
            userId: user.id,
            parentId: parentContentId,
            placement,
          },
          description: comment,
        }
      );
      toggleShowCreateContentModal();
    } catch (e) {
      console.error('CLIENT ERROR: failed to create comment', e);
    }
  };

  function handleKeyDown(e: any) {
    //if key is enter, prevent default
    if (e.key === 'Enter' && comment.length > 0) {
      //if comment is valid, submit comment
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <div>
      <Form style={{ width: '100%' }}>
        <Form.Group>
          <div className='d-flex flex-column'>
            <Form.Control
              className='m-2'
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
              className='mx-auto my-2'
            >
              Create
            </Button>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreateComment;
