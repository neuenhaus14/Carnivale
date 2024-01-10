import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmActionModalProps {
  confirmActionFunction: any;
  setConfirmActionFunction: any;
  confirmActionText: string;
  setConfirmActionText: any;
  showConfirmActionModal: boolean;
  setShowConfirmActionModal: any;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  confirmActionFunction,
  setConfirmActionFunction,
  confirmActionText,
  setConfirmActionText,
  showConfirmActionModal,
  setShowConfirmActionModal,
}) => {

  const handleClose = () => {
    setShowConfirmActionModal(false);
    setConfirmActionFunction(null);
    setConfirmActionText('');
  }

  return (
    <Modal show={showConfirmActionModal}>
      <Modal.Header>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='card-content'>{`Confirm that you want to ${confirmActionText}`}</div>
        <Button onClick={() => confirmActionFunction()}>
          Confirm
        </Button>
        <Button onClick={handleClose}>
          Just Kidding
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmActionModal;
