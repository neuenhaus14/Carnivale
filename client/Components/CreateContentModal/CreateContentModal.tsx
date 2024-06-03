// This modal will be composed of 4 components, one for creating each content type.

import React, { useContext, useEffect, useState } from 'react';

import { IoMdPin } from '@react-icons/all-files/io/IoMdPin';
import { IoMdCalendar } from '@react-icons/all-files/io/IoMdCalendar';
import { IoMdPhotos } from '@react-icons/all-files/io/IoMdPhotos';
import { IoMdText } from '@react-icons/all-files/io/IoMdText';
import { IoMdContacts } from '@react-icons/all-files/io/IoMdContacts';

import { Button, Modal, Tab, Tabs } from 'react-bootstrap';

import CreateComment from './CreateComment';
import CreatePhoto from './CreatePhoto';
import CreatePlan from './CreatePlan';
import CreatePin from './CreatePin';
import FriendManager from './FriendManager';

// Need to be able to create any content and instantly share it with your friends
import { ThemeContext, ContentFunctionsContext } from '../Context';
import { Post } from '../../types';
import axios from 'axios';

interface CreateContentModalProps {
  parentPost: null | Post; // needed to nest content in threads
  postToEdit: null | Post;
  lat: number;
  lng: number;
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({
  parentPost,
  postToEdit,
  lat,
  lng,
}) => {
  // this is for the modal's header
  const [headerText, setHeaderText] = useState<string>('Add a comment');

  const changeHeaderText = (k) => {
    switch (k) {
      case 'comment':
        setHeaderText('Write a comment');
        break;
      case 'photo':
        setHeaderText('Post a photo');
        break;
      case 'pin':
        setHeaderText('Drop a pin');
        break;
      case 'plan':
        setHeaderText('Make a plan');
        break;
      case 'friend':
        setHeaderText('Manage friends');
        break;
      default:
        setHeaderText('Default message. Did you add a new content type?');
        break;
    }
  };

  const { setCreateContentModalBundle } =
    useContext(ContentFunctionsContext);

  const isEditMode = postToEdit ? true : false;


  // once a postToEdit comes through, then set the key and header text for the tab. Otherwise the key is determined by state at the App level, which gets changed when opening the modal from a certain page (so opening the modal from map page opens pin tab)
  useEffect(() => {
    if (postToEdit) {
      setCreateContentModalBundle.setCreateContentModalKey(postToEdit.content.contentableType);
      changeHeaderText(postToEdit.content.contentableType);
    } else {
      changeHeaderText(setCreateContentModalBundle.createContentModalKey);
    }
  }, [setCreateContentModalBundle.createContentModalKey]);

  // useEffect(() => {
  //   setKey(createContentModalKey)
  // }, []);

  const toggleShowCreateContentModal = () => {
    // close the modal
    setCreateContentModalBundle.setShowCreateContentModal(
      !setCreateContentModalBundle.showCreateContentModal
    );
    // always set the postToEditBack to null
    setCreateContentModalBundle.setPostToEdit(null);
  };

  const submitContent = async (
    contentType: 'plan' | 'pin' | 'comment' | 'photo',
    payload
  ) => {
    try {
      switch (contentType) {
        case 'plan':
          await axios.post('/api/plan/createPlan', payload);
          break;
        case 'pin':
          await axios.post('/api/pin/createPin', payload);
          break;
        case 'comment':
          await axios.post('/api/comment/createComment', payload);
          break;
        case 'photo':
          await axios.post('/api/photo/createPhoto', payload);
          break;
        default:
          break;
      }
    } catch (e) {
      console.error('CLIENT ERROR: failed to submit content', e);
    } finally {
      toggleShowCreateContentModal();
    }
  };

  // TODO: write this function similarly to submitContent
  const updateContent = async () => {
    console.log('do this');
  };

  return (
    <Modal
      show={setCreateContentModalBundle.showCreateContentModal}
      onHide={toggleShowCreateContentModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>{headerText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          activeKey={setCreateContentModalBundle.createContentModalKey}
          onSelect={(k: 'comment' | 'pin' | 'plan' | 'friend' | 'photo') => {
            changeHeaderText(k);
            setCreateContentModalBundle.setCreateContentModalKey(k);
          }}
        >
          <Tab eventKey='comment' title={<IoMdText size='24px' />}>
            <CreateComment
              postToEdit={postToEdit}
              parentPost={parentPost}
              lat={lat}
              lng={lng}
              submitContent={submitContent}
              updateContent={updateContent}
            />
          </Tab>
          <Tab eventKey='photo' title={<IoMdPhotos size='24px' />}>
            <CreatePhoto
              postToEdit={postToEdit}
              parentPost={parentPost}
              lat={lat}
              lng={lng}
              submitContent={submitContent}
              updateContent={updateContent}
            />
          </Tab>
          <Tab eventKey='pin' title={<IoMdPin size='24px' />}>
            <CreatePin
              postToEdit={postToEdit}
              parentPost={parentPost}
              lat={lat}
              lng={lng}
              submitContent={submitContent}
              updateContent={updateContent}
            />
          </Tab>
          <Tab eventKey='plan' title={<IoMdCalendar size='24px' />}>
            <CreatePlan
              postToEdit={postToEdit}
              parentPost={parentPost}
              lat={lat}
              lng={lng}
              submitContent={submitContent}
              updateContent={updateContent}
            />
          </Tab>
          <Tab eventKey='friend' title={<IoMdContacts size='24px' />}>
            <FriendManager />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default CreateContentModal;
