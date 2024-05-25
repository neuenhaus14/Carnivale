// This modal will be composed of 4 components, one for creating each content type.



import React from 'react';

import { Modal, Tab, Tabs } from 'react-bootstrap';

import CreateComment from './CreateComment';

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

const CreateContentModal: React.FC<CreateContentModalProps> = ({showCreateContentModal, setShowCreateContentModal, defaultTab, parentContentId, lat, lng}) => {

  const toggleShowCreateContentModal = () => setShowCreateContentModal(!showCreateContentModal);


  return (<Modal show={showCreateContentModal} onHide={toggleShowCreateContentModal}>
<Modal.Header closeButton>
  <Modal.Title>Create Content</Modal.Title>
</Modal.Header>
<Modal.Body>
    <Tabs>
      <Tab eventKey='comment' title='Comment' >
    <CreateComment parentContentId={parentContentId} lat={lat} lng={lng} toggleShowCreateContentModal={toggleShowCreateContentModal}/>
      </Tab>
      <Tab eventKey='photo' title='Photo'>

      </Tab>
      <Tab eventKey='pin' title='Pin'>

      </Tab>
      <Tab eventKey='plan' title='Plan'>

      </Tab>
    </Tabs>
</Modal.Body>
  </Modal>)

}

export default CreateContentModal;
