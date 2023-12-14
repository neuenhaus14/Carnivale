import React, {useState, useEffect} from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import Photos from './Photos'

//CHILD OF HOMEPAGE
interface Props {
  setShowModal: any
  lat: number
  lng: number
}

const HomeModal: React.FC<Props> = ( {
  setShowModal, lat, lng
} ) => {
  const [isShow, setIsShow] = useState(true);
  const [isThrow, setIsThrow] = useState(false);
  const [isCostume, setIsCostume] = useState(false);

  //func to reset boolean state if hot goss is clicked
  const resetBooleanState = () => {
    setIsThrow(false)
    setIsCostume(false)
  }

  //function for init modal
  const initModal = ()  => {
    setIsShow(!isShow);
    setShowModal(!isShow);
  }

  const createPhoto = async () => {
    initModal()
    try{
     console.log('test')
    } catch (err)  {
      console.error(err)
    }
  }


  return (
    <Modal show={isShow} onHide={initModal}>
        <Modal.Header closeButton >
          <Modal.Title>Create a Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Is this a costume? Mardi Gras Throw? Or Hot Goss?
          <Form>
            <Form.Group className ='mb-3' controlId="pinType">
              <Form.Check type="radio" id="costume" name="pin-cat"
                label="Costume"  inline isValid
                onClick={() => {resetBooleanState(); setIsCostume(!isCostume)} }
                />
               <Form.Check type="radio" id="throw" name="pin-cat"
                label="Throw"  inline isValid
                onClick={() => {resetBooleanState(); setIsThrow(!isThrow)} }
                />
                <Form.Check type="radio" id="goss" name="pin-cat"
                label="Goss" value="goss" inline isValid 
                onClick={() => {resetBooleanState()} }
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="picture spot" >
              <Photos
              latPost={lat}
              lngPost={lng}
              isThrow={isThrow}
              isCostume={isCostume}
              createPhoto={createPhoto}
              lng={null}
              lat={null}
              saveCreatedPin={null}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={initModal}> Close </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default HomeModal;