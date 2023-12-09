import React, {useState, useEffect} from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useParams} from 'react-router-dom'
import axios from 'axios'
import Photos from './Photos'
 
interface Props {
  setShowModal: any
  markers: any
  setMarkers: any 
  isPinSelected: any
  setIsPinSelected: any
  selectedPin: any
}

const PinModal: React.FC<Props> = ( {setShowModal, selectedPin, markers, setMarkers, isPinSelected, setIsPinSelected} ) => {
  const [isShow, setShow] = useState(true);
  const [isToilet, setIsToilet] =useState(false);
  const [isFood, setIsFood] =useState(false);
  const [isPersonal, setIsPersonal] =useState(false);
  const [isFree, setIsFree] =useState(false);
  const [isSaved, setIsSaved] = useState(false);
  //const [marker, setMarkers] = useState([markers]);
  
  const urlSearchString = window.location.search.substring(1);
  const parsedParams = JSON.parse('{"' + urlSearchString.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  
  const { lng } = parsedParams;
  const { lat } = parsedParams;

  const initModal = () => {
    setShow(!isShow); 
    setShowModal(!isShow)
    setIsPinSelected(false);
  };

  const resetBooleanState = () => {
    setIsFree(false)
    setIsToilet(false)
    setIsFood(false)
    setIsPersonal(false)
  }

  const saveCreatedPin = async () => {
    try{
      const { data } = await axios.post(`/api/pins/create-pin/${1}`, {
        options: {
          longitude: lng,
          latitude: lat,
          isToilet,
          isFood,
          isPersonal,
          isFree,
        }
      })
      console.log('whish! pin sent to database')
      setMarkers(markers.concat([data]))
    } catch (err)  {
      console.error(err)
    }
  }
  
  return (
    <>
    { isPinSelected 
    ? (
        <Modal show={isShow} onHide={initModal}>
          <Modal.Header closeButton >
            <Modal.Title>Pin Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="pin-photos">
              <p>Pin from $User</p> 
              {
                selectedPin.map((pin: any) => (
                  <div key={pin.id}>
                    <img src={pin.photoURL} alt="Pin Photo" height="300" width='300'/> 
                    <p>{pin.description}</p>
                  </div>  
                ))
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={initModal}> Close </Button>
            <Button variant="dark "onClick={initModal}> Add Photo </Button>
          </Modal.Footer>
        </Modal>
      )
    : 
    (
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
                onClick={() => {resetBooleanState(); setIsFree(!isFree)} }
                />
              <Form.Check type="radio" id="toilet" name="pin-cat" 
                label="Toilet" value="isToilet" inline isValid 
                onClick={() => {resetBooleanState(); setIsToilet(!isToilet)} }
                />
              <Form.Check type="radio" id="food" name="pin-cat" 
                label="Food" value="isFood" inline isValid 
                onClick={() => {resetBooleanState(); setIsFood(!isFood)} }
                />
              <Form.Check type="radio" id="personal" name="pin-cat" 
                label="Personal" value="isPersonal" inline isValid 
                onClick={() => {resetBooleanState(); setIsPersonal(!isPersonal)} }
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="picture spot" >
              <Form.Label>Placeholder for Picture</Form.Label>
              <Photos lat={lat} lng={lng} saveCreatedPin={saveCreatedPin} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={initModal}> Close </Button>
          {/* { isSaved ? <Button variant="danger" onClick={initModal}> Close </Button>
            : <Button variant="dark" onClick={() => {saveCreatedPin(); setIsSaved(true)} }> Save </Button>
          } */}
        </Modal.Footer>
      </Modal>)
      }
    </>
  )
}

export default PinModal;