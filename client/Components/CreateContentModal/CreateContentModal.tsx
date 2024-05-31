// This modal will be composed of 4 components, one for creating each content type.

import React, { useEffect, useState } from 'react';

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
import { ThemeContext } from '../Context';
import { Post } from '../../types';
import axios from 'axios';

interface CreateContentModalProps {
  parentPost: null | Post; // needed to nest content in threads
  postToEdit: null | Post;
  defaultTab: 'comment' | 'photo' | 'pin' | 'plan'; // indicates what tab defaults to open (ie, 'pin' for map page ,'photo' for feed page)
  lat: number;
  lng: number;
  setConfirmActionBundle: any; // getting sent along to FriendManager
  setCreateContentModalBundle: any; // comes from App level
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({
  setCreateContentModalBundle,
  defaultTab,
  parentPost,
  postToEdit,
  lat,
  lng,
  setConfirmActionBundle,
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

  const isEditMode = postToEdit ? true : false;

  const [key, setKey] = useState<
    'comment' | 'pin' | 'plan' | 'friend' | 'photo'
  >('comment');

  // once a postToEdit comes through, then set the key and text for the tab
  useEffect(() => {
    if (postToEdit) {
      setKey(postToEdit.content.contentableType);
      changeHeaderText(postToEdit.content.contentableType);
    }
  }, [postToEdit]);

  const toggleShowCreateContentModal = () => {
    // close the modal
    setCreateContentModalBundle.setShowCreateContentModal(
      !setCreateContentModalBundle.showCreateContentModal
    );
    // set the postToEditBack to null
    setCreateContentModalBundle.setPostToEdit(null);
  };

  const submitContent = async (
    contentType: 'plan' | 'pin' | 'comment' | 'photo',
    payload
  ) => {
    try {
      let createContentResponse;

      switch (contentType) {
        case 'plan':
          createContentResponse = await axios.post('/api/plan/createPlan', payload)
          break;
        case 'pin':
          createContentResponse = await axios.post(
            '/api/pin/createPin',
            payload
          );
          break;
        case 'comment':
          createContentResponse = await axios.post(
            '/api/comment/createComment',
            payload
          );
          break;
        case 'photo':
          createContentResponse = await axios.post(
            '/api/photo/createPhoto',
            payload
          );
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
  const updateContent = async() => {
    console.log('do this')
  }

  console.log('key', key, 'CCModal isEditMode', isEditMode);
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
          activeKey={key}
          onSelect={(k: 'comment' | 'pin' | 'plan' | 'friend' | 'photo') => {
            changeHeaderText(k);
            setKey(k);
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
            <FriendManager setConfirmActionBundle={setConfirmActionBundle} />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default CreateContentModal;
