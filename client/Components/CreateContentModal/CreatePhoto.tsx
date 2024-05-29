import React, { useContext, useState } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import { RunModeContext, UserContext } from '../Context';

import { Photo, Post } from '../../types';
import CreateContentOptions from './CreateContentOptions';

interface CreatePhotoProps {
  postToEdit: null | Post;
  parentPost: null | Post;
  lat: number;
  lng: number;
  // toggleShowCreateContentModal: any;
  submitContent: any;
}

const CreatePhoto: React.FC<CreatePhotoProps> = ({
  postToEdit,
  parentPost,
  lat,
  lng,
  // toggleShowCreateContentModal,
  submitContent,
}) => {
  // PHOTO-SPECIFIC STATE
  const [previewSource, setPreviewSource] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState(null);

  const [photo, setPhoto] = useState<Photo>({
    id: null,
    photoURL: '',
    description: '',
    createdAt: '',
    updatedAt: '',
  });

  // CONTENT STATE
  const [isPhotoPrivate, setIsPhotoPrivate] = useState<boolean>(false);
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]);

  // CONTEXT & ENV
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const { user, votes, friends } = useContext(UserContext);
  const tabCategories = process.env.TAB_CATEGORIES.split(' ');

  const isEditMode =
    postToEdit && postToEdit.content.contentableType === 'comment'
      ? true
      : false;

  // prevents hitting enter to send empty comments
  const handleKeyDown = (e: any) => {
    //if key is enter, prevent default
    if (e.key === 'Enter' && photo.description.length > 0) {
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
      // TODO: add isEditMode? for routing in server
      content: {
        latitude: lat,
        longitude: lng,
        userId: user.id,
        parentPost: parentPost,
        placement: isPhotoPrivate ? 'private' : 'public',
      },
      description: photo.description,
      tags: tags,
      friendsToShareWith,
    };

    const payload = new FormData();
    payload.append('imageFile', file);
    payload.append('contentDetails', JSON.stringify(contentDetails));

    try {
      submitContent('photo', payload);
    } catch (e) {
      console.error('CLIENT ERROR: failed to create comment', e);
    } finally {
      setLoading(false);
      // toggleShowCreateContentModal();
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

  console.log('photo', photo);
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
              onChange={(e) =>
                setPhoto({ ...photo, description: e.target.value })
              }
              value={photo.description}
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
                disabled={isDemoMode || photo.description.length <= 0}
                className='mx-4'
              >
                {loading ? 'Saving...' : 'Post It'}
              </Button>
            </div>
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
                <Accordion.Header>Tag and Share Options</Accordion.Header>
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
            </Accordion> */}
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreatePhoto;
