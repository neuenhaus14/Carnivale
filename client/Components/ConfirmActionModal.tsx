import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ThemeContext } from './Context';

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
  const theme = useContext(ThemeContext);

  const handleClose = () => {
    setShowConfirmActionModal(false);
    setConfirmActionFunction(null);
    setConfirmActionText('');
  }

  return (
    <Modal className={`confirm-action-modal ${theme}`} show={showConfirmActionModal}>
      <Modal.Header>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='ep-card-content'>{`Click Confirm to ${confirmActionText}`}</div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant='danger' onClick={() => {
          confirmActionFunction()
          handleClose()
        }}>
          Confirm
        </Button>
        <Button onClick={handleClose}>
          Just Kidding
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmActionModal;
