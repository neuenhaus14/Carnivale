import React, {useState, useEffect} from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const CreatePin = ( change: any ) => {
   const [isShow, setShow] = useState(true);

  const initModal = () => {
    setShow(!isShow); 
    change(!isShow)
    console.log(isShow)
  };

  const saveCreatedPin = (e: any) => {
    const selectedCategory = e.target.value
    console.log(e)
  }

  return (
    <>
      {/* <Button variant="success" onClick={initModal}>
        Open Modal
      </Button> */}
      <Modal show={isShow} onHide={initModal}>
        <Modal.Header closeButton >
          <Modal.Title>Create a Pin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Select a category, add a picture, and save your pin. 
          <Form>
            <Form.Group className ='mb-3' controlId="pinType">
              <Form.Check type="radio" id="freeToilet" name="pin-cat" 
                label="Free Toilet" value="isFree" inline isValid 
                onClick={(e) => {saveCreatedPin(e)} }
                />
              <Form.Check type="radio" id="toilet" name="pin-cat" 
                label="Toilet" value="isToilet" inline isValid 
                onClick={(e) => {saveCreatedPin(e)} }
                />
              <Form.Check type="radio" id="food" name="pin-cat" 
                label="Food" value="isFood" inline isValid 
                onClick={(e) => {saveCreatedPin(e)} }
                />
              <Form.Check type="radio" id="personal" name="pin-cat" 
                label="Personal" value="isPersonal" inline isValid 
                onClick={(e) => {saveCreatedPin(e)} }
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="picture spot" >
              <Form.Label>Placeholder for Picture</Form.Label>
              <Form.Control as="textarea" rows={5} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={initModal}> Close </Button>
          <Button variant="dark" onClick={initModal}> Save </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreatePin;