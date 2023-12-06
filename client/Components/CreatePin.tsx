import React, {useState, useEffect} from 'react'
import { Modal, Button } from 'react-bootstrap'

const CreatePin = ({isShow}) => {
  const [isShown, setShow] = useState(isShow);

  const initModal = () => {
    setShow(!isShown); 
    console.log(isShown)
   
  };

  console.log(isShown)

  return (
    <>
      {/* <Button variant="success" onClick={initModal}>
        Open Modal
      </Button> */}
      <Modal show={isShown} onHide={initModal}>
        <Modal.Header closeButton >
          <Modal.Title>React Modal Popover Example</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={initModal}>
            Close
          </Button>
          <Button variant="dark" onClick={initModal}>
            Store
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreatePin;