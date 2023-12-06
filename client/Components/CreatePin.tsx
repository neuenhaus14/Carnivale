import React, {useState, useEffect} from 'react'
import { Modal, Button } from 'react-bootstrap'

const CreatePin = ({ change }) => {
   const [isShow, setShow] = useState(true);

  const initModal = () => {
    setShow(!isShow); 
    change(!isShow)
    console.log(isShow)
  };

  // useEffect (() => {
  //   setShow(true)
  //   console.log(isShow)
  // }, [])

  // console.log(isShow)

  return (
    <>
      {/* <Button variant="success" onClick={initModal}>
        Open Modal
      </Button> */}
      <Modal show={isShow} onHide={initModal}>
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