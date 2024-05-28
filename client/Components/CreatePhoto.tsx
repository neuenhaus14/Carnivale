import React, { useContext, useState } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import { RunModeContext, UserContext } from './Context';
import axios from 'axios';
import { Post } from '../types';

interface CreatePhotoProps {
  postToEdit: null | Post;
  parentPost: null | Post;
  lat: number;
  lng: number;
  toggleShowCreateContentModal: any;
}

const CreatePhoto: React.FC<CreatePhotoProps> = ({
  postToEdit,
  parentPost,
  lat,
  lng,
  toggleShowCreateContentModal,
}) => {
  // PHOTO-SPECIFIC STATE
  const [previewSource, setPreviewSource] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  // CONTENT STATE
  const [isPhotoPrivate, setIsPhotoPrivate] = useState<boolean>(false);
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]);

  // CONTEXT & ENV
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const { user, votes, friends } = useContext(UserContext);
  const tabCategories = process.env.TAB_CATEGORIES.split(' ');

  // FUNCTIONS FOR MANAGING CONTENT STATE
  const handleCheckedTag = (e: any) => {
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
    } else if (e.target.name === 'description') {
      setDescription(e.target.value);
    }
  };
  // add tag from input into tags. TODO: update so inputting a tabCategory will check the checkbox for that specific category; right now it just doesn't get added
  const addInputTag = () => {
    // check to see if input tag is already in tags or if its one from the tabCategories (had to adjust for capitalizations)
    if (
      !tags.includes(tag.toLowerCase()) &&
      !tabCategories
        .map((category) => {
          return category.toLowerCase();
        })
        .includes(tag.toLowerCase())
    ) {
      setTags([...tags, tag.toLowerCase()]);
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
  const toggleFriendToShareWith = (e: any) => {
    const { value } = e.target;

    if (!friendsToShareWith.includes(value)) {
      setFriendsToShareWith([...friendsToShareWith, value]);
    } else if (friendsToShareWith.includes(value)) {
      setFriendsToShareWith(
        friendsToShareWith.filter((friendId) => friendId !== value)
      );
    }
  };

  // prevents hitting enter to send empty comments
  const handleKeyDown = (e: any) => {
    //if key is enter, prevent default
    if (e.key === 'Enter' && description.length > 0) {
      //if comment is valid, submit comment
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  //
  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();

    const contentDetails = {
      content: {
        latitude: lat,
        longitude: lng,
        userId: user.id,
        parentPost: parentPost,
        placement: isPhotoPrivate ? 'private' : 'public',
      },
      description,
      tags: tags,
      friendsToShareWith,
    }

    const photoData = new FormData();
    photoData.append('imageFile', file);
    photoData.append('contentDetails', JSON.stringify(contentDetails))

    try {
      const createPhotoResponse = await axios.post('/api/photo/createPhoto', photoData);

    } catch (e) {
      console.error('CLIENT ERROR: failed to create comment', e);
    } finally {
      setLoading(false);
      toggleShowCreateContentModal();
    }
  };

  const handleSelectFile = (e: any) => {
    const file = e.target.files[0];
    e.preventDefault();
    setFile(file);
    previewFile(file);
  };

  const previewFile = (file: any) => {
    const reader = new FileReader(); //built into JS API
    reader.readAsDataURL(file); //convert image to a string
    reader.onloadend = () => {
      const result: any = reader.result;
      setPreviewSource(result); // if set we want to display it
    };
  };

  return (
    <div>
      <Form className='w-100'>
        <Form.Group>
          <div className='d-flex flex-column justify-content-center'>

            {/* IMAGE PREVIEW */}
            {previewSource && (
              <img
                src={previewSource}
                alt='Image selected for upload'
                className='mx-auto mt-2 w-75 rounded'
              />
            )}
            {/* IMAGE FILE SELECTOR */}
            <input
              className='mx-auto mt-2 w-75'
              id='file'
              type='file'
              name='image'
              onChange={handleSelectFile}
              multiple={false}
            />

            {/* Description INPUT */}
            <Form.Control
              className='mt-2'
              placeholder='Add a description to your photo'
              onChange={handleInput}
              value={description}
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
                  defaultChecked={isPhotoPrivate}
                  onChange={() => setIsPhotoPrivate(!isPhotoPrivate)}
                />
                <p className='mb-0'>Friends only</p>
              </div>
              {/* CREATE COMMENT BUTTON */}
              <Button
                variant='primary'
                onClick={handleSubmit}
                disabled={isDemoMode || description.length <= 0}
                className='mx-4'
              >
               {loading ? "Saving..." : "Post It"}
              </Button>
            </div>
            <Accordion>
              <Accordion.Item eventKey='0'>
                <Accordion.Header>Tag and Share Options</Accordion.Header>
                <Accordion.Body>
                  <h5>Add Tags</h5>
                  {/* TAGS FROM CATEGORY TABS */}
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

                  {/* TAG INPUT */}

                  <div className='d-flex flex-row'>
                    <Form.Control
                      className='m-2'
                      placeholder='Custom tag goes here'
                      onChange={handleInput}
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

                  {/* LIST OF TAGS ADDED THRU INPUT */}
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

                  {/* SHARE WITH FRIENDS LIST */}
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
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreatePhoto;
