import React, {useState, useEffect} from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useParams} from 'react-router-dom'
import axios from 'axios'
 
const CreatePin = ( change: any, searchParams: any ) => {
  const [isShow, setShow] = useState(true);
  const [isToilet, setIsToilet] =useState(false);
  const [isFood, setIsFood] =useState(false);
  const [isPersonal, setIsPersonal] =useState(false);
  const [isFree, setIsFree] =useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const urlSearchString = window.location.search.substring(1);
  const parsedParams = JSON.parse('{"' + urlSearchString.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  
  const { lng } = parsedParams;
  const { lat } = parsedParams;


  const initModal = () => {
    setShow(!isShow); 
    change(!isShow);
    console.log(isShow);
  };

  const resetBooleanState = () => {
    setIsFree(false)
    setIsToilet(false)
    setIsFood(false)
    setIsPersonal(false)
    // console.log('inside', isFree, isToilet, isFood, isPersonal)
  }


  const saveCreatedPin = async () => {
    // TODO - DECONSTRUCT DATA FROM THE RESPONSE AND ADD THAT TO THE MARKERS ARRAY
    // AS USER CREATED PINS??? IF YOU KEEP THEM SEPARATE IN THESE COMPONENTS? EH... IDK
    try{
      const response = await axios.post(`/api/pins/create-pin/${1}`, {
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
      console.log(response)
    } catch (err)  {
      console.error(err)
    }
  }
  
  // console.log('outside', isFree, isToilet, isFood, isPersonal)
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
              <Form.Control as="textarea" rows={5} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          { isSaved ? <Button variant="danger" onClick={initModal}> Close </Button>
            : <Button variant="dark" onClick={() => {saveCreatedPin(); setIsSaved(true)} }> Save </Button>
            
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreatePin;