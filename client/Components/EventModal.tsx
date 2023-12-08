import React, {useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap'
import EventMapComponent from './EventMapComponent';
import axios from 'axios';

interface EventModalProps {
  selectedEvent: object,
  setShowModal: any,
  showModal: boolean
}

const EventModal: React.FC<EventModalProps> = ({selectedEvent, setShowModal, showModal}) => {


const handleClose = () => {
  setShowModal(false); // 
}

  return (
    <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          {/* <EventMapComponent /> */}
          Woohoo, you are reading this text in a modal!
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  )

};

export default EventModal;