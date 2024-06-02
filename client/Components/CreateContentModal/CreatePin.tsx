import React, { useContext, useEffect, useState } from 'react';
import { Pin, Post } from '../../types';
import { RunModeContext, UserContext } from '../Context';
import { Button, Form } from 'react-bootstrap';
import CreateContentOptions from './CreateContentOptions';

interface CreatePinProps {
  postToEdit: null | Post;
  parentPost: null | Post;
  lat: number;
  lng: number;
  submitContent: any;
  updateContent: any;
}

const CreatePin: React.FC<CreatePinProps> = ({
  postToEdit,
  parentPost,
  lat,
  lng,
  submitContent,
  updateContent,
}) => {
  // PIN-SPECIFIC STATE
  const [previewSource, setPreviewSource] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState(null);
  const [pin, setPin] = useState<Pin>({
    id: null,
    pinType: '',
    photoURL: '',
    description: '',
    latitude: lat, // set pin lat to user's current lat
    longitude: lng, // same with lng
    createdAt: '',
    updatedAt: '',
  });
  const pinTypes = process.env.PIN_TYPES.split(' ');

  // CONTENT STATE
  const [tags, setTags] = useState<string[]>([]);
  const [isPinPrivate, setIsPinPrivate] = useState<boolean>(false);
  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]); // just ids here

  // CONTEXTS & INCOMING POST
  const { user, votes, friends } = useContext(UserContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const isEditMode =
    postToEdit && postToEdit.content.contentableType === 'pin' ? true : false;

  useEffect(() => {
    if (isEditMode) {
      setPin(postToEdit.contentable);
      setIsPinPrivate(
        postToEdit.content.placement === 'private' ? true : false
      );
    }
  }, []);

  // COMPONENT FUNCTIONALITY
  const handleKeyDown = (e: any) => {
    //if key is enter, prevent default
    if (e.key === 'Enter' && pin.description.length > 0) {
      //if comment is valid, submit comment
      e.preventDefault();
      handlePinSubmit(e);
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handlePinSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();

    const contentDetails = {
      content: {
        latitude: lat,
        longitude: lng,
        userId: user.id,
        parentPost: parentPost,
        placement: isPinPrivate ? 'private' : 'public',
      },
      // the pin gets dropped right where you are
      // can't have id, createdAt, updatedAt or photoURL for new pin
      latitude: pin.latitude,
      longitude: pin.longitude,
      pinType: pin.pinType,
      description: pin.description,
      tags,
      friendsToShareWith,
    };

    const payload = new FormData();
    payload.append('imageFile', file);
    payload.append('contentDetails', JSON.stringify(contentDetails));

    try {
      submitContent('pin', payload);
    } catch (e) {
      console.error('CLIENT ERROR: failed to create pin', e);
    } finally {
      setLoading(false);
    }
  };

  // TODO:
  const handlePinUpdate = async () => {
    console.log('handlePlanUpdate executed');
  };

  const handlePinInput = async (e) => {
    setPin({ ...pin, [e.target.name]: e.target.value });
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

  console.log('pin', pin);
  return (
    <div>
      <Form>
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

            {isEditMode && (
              <img
                src={pin.photoURL}
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

            {/*  PIN TYPE RADIOS */}
            <div className='mt-2 d-flex flex-wrap justify-content-around'>
              {pinTypes.map((pinType, index) => {
                return (
                  <Form.Check
                    className='mx-1'
                    type='radio'
                    name={`${pinType}`}
                    key={`${pinType}-${index}`}
                    checked={pin.pinType === pinType}
                    onChange={() => setPin({ ...pin, pinType: pinType })}
                    label={`${pinType.replace('_', ' ')}`}
                  />
                );
              })}
            </div>

            {/* DESCRIPTION INPUT */}
            <Form.Control
              className='mt-2'
              placeholder='Add a description to your pin'
              onChange={handlePinInput}
              value={pin.description}
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
                  checked={isPinPrivate}
                  onChange={() => setIsPinPrivate(!isPinPrivate)}
                />
                <p className='mb-0'>Friends only</p>
              </div>
              {/* CREATE COMMENT BUTTON */}
              {isEditMode ? (
                <Button
                  variant='primary'
                  onClick={handlePinUpdate}
                  disabled={isDemoMode || pin.description.length <= 0}
                  className='mx-4'
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant='primary'
                  onClick={handlePinSubmit}
                  disabled={isDemoMode || pin.description.length <= 0}
                  className='mx-4'
                >
                  {loading ? 'Saving...' : 'Post It'}
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

export default CreatePin;
