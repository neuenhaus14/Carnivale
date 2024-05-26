// This modal will be composed of 4 components, one for creating each content type.

import React, { useState } from 'react';

import { IoMdPin } from '@react-icons/all-files/io/IoMdPin';
import { IoMdCalendar } from '@react-icons/all-files/io/IoMdCalendar';
import { IoMdPhotos } from '@react-icons/all-files/io/IoMdPhotos';
import { IoMdText } from '@react-icons/all-files/io/IoMdText';
import { IoMdContacts } from '@react-icons/all-files/io/IoMdContacts';

import { Modal, Tab, Tabs } from 'react-bootstrap';

import CreateComment from './CreateComment';
import CreatePhoto from './CreatePhoto';

// Need to be able to create any content and instantly share it with your friends
import { ThemeContext } from './Context';

interface CreateContentModalProps {
  showCreateContentModal: boolean;
  setShowCreateContentModal: any;
  parentContentId: null | number; // needed to nest content in threads
  defaultTab: 'comment' | 'photo' | 'pin' | 'plan'; // indicates what tab defaults to open (ie, 'pin' for map page ,'photo' for feed page)
  lat: number;
  lng: number;
}

const CreateContentModal: React.FC<CreateContentModalProps> = ({
  showCreateContentModal,
  setShowCreateContentModal,
  defaultTab,
  parentContentId,
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
        setHeaderText('Add a friend');
        break;
      default:
        setHeaderText('Default message. Did you add a new content type?');
        break;
    }
  };

  const [key, setKey] = useState('comment');

  const toggleShowCreateContentModal = () =>
    {
      console.log('top of ToggleShow in CCM')
      setShowCreateContentModal(!showCreateContentModal)};

  return (
    <Modal show={showCreateContentModal} onHide={toggleShowCreateContentModal}>
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
              parentContentId={parentContentId}
              lat={lat}
              lng={lng}
              toggleShowCreateContentModal={toggleShowCreateContentModal}
            />
          </Tab>
          <Tab
            onClick={() => setHeaderText('Post a photo')}
            eventKey='photo'
            title={<IoMdPhotos size='24px' />}
          >
            <CreatePhoto
              parentContentId={parentContentId}
              lat={lat}
              lng={lng}
              toggleShowCreateContentModal={toggleShowCreateContentModal}
            />
          </Tab>
          <Tab
            onClick={() => setHeaderText('Drop a pin')}
            eventKey='pin'
            title={<IoMdPin size='24px' />}
          ></Tab>
          <Tab
            onClick={() => setHeaderText('Make a plan')}
            eventKey='plan'
            title={<IoMdCalendar size='24px' />}
          ></Tab>
          <Tab
            onClick={() => setHeaderText('Add a friend')}
            eventKey='friend'
            title={<IoMdContacts size='24px' />}
          ></Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default CreateContentModal;
