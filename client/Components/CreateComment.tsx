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
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const isDemoMode = useContext(RunModeContext) === 'demo';
  const { user, votes, friends } = useContext(UserContext);
  const tabCategories = process.env.TAB_CATEGORIES.split(' ');

  const checkTag = (e: any) => {
    // console.log('e.target', e.target, e.target.value, e.target.name);
    const { value } = e.target;

    if (!tags.includes(value)) {
      setTags([...tags, value]);
    } else if (tags.includes(value)) {
      setTags(tags.filter((tag) => tag !== value));
    }
  };

  const handleInput = (e: any) => {
    if (e.target.name === 'tag') {
      setTag(e.target.value);
    } else if (e.target.name === 'comment') {
      setComment(e.target.value);
    }
  };

  // add tag from input into tags
  const addTag = () => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag('');
    } else {
      setTag(''); // might be nice to have a toast warning
    }
  };

  // remove tag from list of added tags
  const removeTag = (e: any) => {
    const { name } = e.target;
    setTags(tags.filter((tag) => tag !== name));
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
          tags: tags,
        }
      );
      toggleShowCreateContentModal();
    } catch (e) {
      console.error('CLIENT ERROR: failed to create comment', e);
    }
  };

  // prevents hitting enter to send empty comments
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

  console.log('tags', tags);
  return (
    <div>
      <Form style={{ width: '100%' }}>
        <Form.Group>
          <div className='d-flex flex-column'>
            <Form.Control
              className='m-2'
              placeholder='Post a comment'
              onChange={handleInput}
              value={comment}
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
              name='comment'
            />
            <div className='d-flex flex-row'>
              {tabCategories.map((category, index) => {
                return (
                  <Form.Check
                    type='checkbox'
                    title={`${category}`}
                    label={`${category}`}
                    value={`${category.toLowerCase()}`}
                    key={`${index}-${category}`}
                    onChange={checkTag}
                  />
                );
              })}
            </div>
            <div className='d-flex flex-row'>
              <Form.Control
                className='m-2'
                placeholder='Custom tag goes here'
                onChange={handleInput}
                value={tag}
                name='tag'
              />
              <Button onClick={addTag} disabled={tag.length === 0}>
                Add Tag
              </Button>
            </div>
            {tags.map((tag, index) => {
              return (
                <div className='d-flex flex-row' key={`${tag}-${index}`}>
                  <p>{tag}</p>
                  <Button variant='danger' name={`${tag}`} onClick={removeTag}>
                    X
                  </Button>
                </div>
              );
            })}
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
