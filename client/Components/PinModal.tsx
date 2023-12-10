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
  const [showPhoto, setShowPhoto] = useState(true);
  //const [marker, setMarkers] = useState([markers]);
  
  const urlSearchString = window.location.search.substring(1);
  const parsedParams = JSON.parse('{"' + urlSearchString.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  
  // const { lng } = parsedParams;
  // const { lat } = parsedParams;
  const { lng } = parsedParams;
  const { lat } = parsedParams;
  const  lngRounded = Math.round(lng * 100) / 100;
  const  latRounded = Math.round(lat * 100) / 100;

  console.log(lngRounded, latRounded)


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
    initModal()
    if (!isPinSelected){
      try{
        const { data } = await axios.post(`/api/pins/create-pin/${1}`, {
          options: {
            longitude: lngRounded,
            latitude: latRounded,
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
  }
  

  return (
    <>
    { isPinSelected 
    ? (
        <Modal show={isShow} onHide={initModal}>
          <Modal.Header closeButton >
            { selectedPin.map((pin: any) => (
            <Modal.Title key={pin.id}>{pin.pinCategory.slice(2)} Pins</Modal.Title>
            ))}
          </Modal.Header>
          { showPhoto ? (
          <div> 
          <Modal.Body>
            <div id="pin-photos">
                {
                  selectedPin.map((pin: any) => (
                    <div key={pin.id}>
                      <p><b>Submitted by: </b>{pin.firstName} {pin.lastName}</p>
                      <img src={pin.photoURL} alt="Pin Photo" height="300" width='300'/> 
                      <p>{pin.description}</p>
                    </div>  
                  ))
                }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={initModal}> Close </Button>
            <Button variant="dark "onClick={() => {setShowPhoto(false)}}> Add Photo </Button>
          </Modal.Footer>
          </div>
            ) : (
          <div>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="picture spot" >
            <Photos lat={latRounded} lng={lngRounded} saveCreatedPin={saveCreatedPin} />
              {/* <h1>Take a picture!</h1>
              <Form.Label>Add a description</Form.Label>
              <Form.Control as="textarea" rows={1} /> */}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={initModal}> Close </Button>
            {/* <Button variant="dark "onClick={initModal}> Save Photo </Button> */}
          </Modal.Footer>
          </div>
              )
            }
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
              <Photos lat={latRounded} lng={lngRounded} saveCreatedPin={saveCreatedPin} />
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