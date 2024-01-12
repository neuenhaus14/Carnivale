import React, {useState, useEffect, useContext} from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import Photos from './Photos'
import { ThemeContext } from './Context'


//CHILD OF HOMEPAGE
interface Props {
  setShowModal: any
  lat: number
  lng: number
  userId: number
}

const HomeModal: React.FC<Props> = ( {
  setShowModal, lat, lng, userId
} ) => {
  const theme = useContext(ThemeContext)
  const [isShow, setIsShow] = useState(true);
  const [isThrow, setIsThrow] = useState(false);
  const [isCostume, setIsCostume] = useState(false);

  //func to reset boolean state if hot goss is clicked
  const resetBooleanState = () => {
    setIsThrow(false)
    setIsCostume(false)
    console.log('Bool state updated')
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
    <Modal className={theme} show={isShow} onHide={initModal}>
        <Modal.Header id="modal-header" closeButton >
          <Modal.Title>Create a Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Is this Gossip? Costumes? Or a Mardi Gras Throw?
          <Form>
            <Form.Group className ='mb-3' controlId="pinType">
              <Form.Check
              type="radio"
              id="goss"
              name="pin-cat"
              label="Gossip"
              value="goss"
              inline
              isValid
              defaultChecked
              onClick={() => {resetBooleanState()} }
                  />
              <Form.Check
              type="radio"
              id="costume"
              name="pin-cat"
              label="Costume"
              inline
              isValid
              onClick={() => {resetBooleanState(); setIsCostume(!isCostume)} }
                />
              <Form.Check
              type="radio"
              id="throw"
              name="pin-cat"
              label="Throw"
              inline
              isValid
              onClick={() => {resetBooleanState(); setIsThrow(!isThrow)} }
                />
            </Form.Group>
            <Form.Group
            className="mb-3"
            controlId="picture spot">
              <Photos
              latPost={lat}
              lngPost={lng}
              isThrow={isThrow}
              isCostume={isCostume}
              createPhoto={createPhoto}
              lng={null}
              lat={null}
              saveCreatedPin={null}
              userId={userId}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer id="modal-footer">
        </Modal.Footer>
      </Modal>
  )
}

export default HomeModal;