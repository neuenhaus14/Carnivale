import React, { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import { RunModeContext, UserContext } from '../Context';

import { Photo, Post } from '../../types';
import CreateContentOptions from './CreateContentOptions';

interface CreatePhotoProps {
  postToEdit: null | Post;
  parentPost: null | Post;
  lat: number;
  lng: number;
  submitContent: any;
}

const CreatePhoto: React.FC<CreatePhotoProps> = ({
  postToEdit,
  parentPost,
  lat,
  lng,
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
  const [tags, setTags] = useState<string[]>([]);
  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]); // just ids here

  // CONTEXTS & INCOMING POST
  const { user, votes, friends } = useContext(UserContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const isEditMode =
    postToEdit && postToEdit.content.contentableType === 'photo'
      ? true
      : false;
  useEffect(() => {
    if (isEditMode) {
      setPhoto(postToEdit.contentable);
      setIsPhotoPrivate(
        postToEdit.content.placement === 'private' ? true : false
      );
    }
  }, []);

  // COMPONENT FUNCTIONALITY
  // prevents hitting enter and sending empty photo description
  const handleKeyDown = (e: any) => {
    //if key is enter, prevent default
    if (e.key === 'Enter' && photo.description.length > 0) {
      //if comment is valid, submit comment
      e.preventDefault();
      handlePhotoSubmit(e);
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handlePhotoSubmit = async (e: any) => {
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
      description: photo.description,
      tags,
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
    }
  };

  // TODO: create route on server to update photo record
  const handlePhotoUpdate = async () => {
    console.log('handlePhotoUpdate executed');
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

            {/* DESCRIPTION INPUT */}
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
              {isEditMode ? (
                <Button
                  variant='primary'
                  onClick={handlePhotoUpdate}
                  disabled={isDemoMode || photo.description.length <= 0}
                  className='mx-4'
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant='primary'
                  onClick={handlePhotoSubmit}
                  disabled={isDemoMode || photo.description.length <= 0}
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

export default CreatePhoto;
