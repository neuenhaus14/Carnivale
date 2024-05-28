// This modal will be composed of 4 components, one for creating each content type.

import React, { useEffect, useState } from 'react';

import { IoMdPin } from '@react-icons/all-files/io/IoMdPin';
import { IoMdCalendar } from '@react-icons/all-files/io/IoMdCalendar';
import { IoMdPhotos } from '@react-icons/all-files/io/IoMdPhotos';
import { IoMdText } from '@react-icons/all-files/io/IoMdText';
import { IoMdContacts } from '@react-icons/all-files/io/IoMdContacts';

import { Modal, Tab, Tabs } from 'react-bootstrap';

import CreateComment from './CreateComment';
import CreatePhoto from './CreatePhoto';
import CreatePlan from './CreatePlan';
import FriendManager from './FriendManager';

// Need to be able to create any content and instantly share it with your friends
import { ThemeContext } from './Context';
import { Post } from '../types';

interface CreateContentModalProps {
  parentPost: null | Post; // needed to nest content in threads
  postToEdit: null | Post;
  defaultTab: 'comment' | 'photo' | 'pin' | 'plan'; // indicates what tab defaults to open (ie, 'pin' for map page ,'photo' for feed page)
  lat: number;
  lng: number;
  setConfirmActionBundle: any; // getting sent along to FriendManager
  setCreateContentModalBundle: any;
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

  const [key, setKey] = useState('comment');

  useEffect(() => {
    if (postToEdit) {
      console.log('there is a post to edit')
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

  console.log('key', key)
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
          onSelect={(k) => {
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
              toggleShowCreateContentModal={toggleShowCreateContentModal}
            />
          </Tab>
          <Tab eventKey='photo' title={<IoMdPhotos size='24px' />}>
            <CreatePhoto
              postToEdit={postToEdit}
              parentPost={parentPost}
              lat={lat}
              lng={lng}
              toggleShowCreateContentModal={toggleShowCreateContentModal}
            />
          </Tab>
          <Tab eventKey='pin' title={<IoMdPin size='24px' />}></Tab>
          <Tab eventKey='plan' title={<IoMdCalendar size='24px' />}>
            <CreatePlan
              postToEdit={postToEdit}
              parentPost={parentPost}
              lat={lat}
              lng={lng}
              toggleShowCreateContentModal={toggleShowCreateContentModal}
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
