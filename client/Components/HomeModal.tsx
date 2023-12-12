import React, {useState, useEffect} from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import Photos from './Photos'

//CHILD OF HOMEPAGE
interface Props {
  setShowModal: any
}
//TODO: Gretchen will add a function to get lat long

const HomeModal: React.FC<Props> = ( {
  setShowModal
} ) => {
  const [isShow, setIsShow] = useState(true);
  const [isThrow, setIsThrow] = useState(false);
  const [isCostume, setIsCostume] = useState(false);

  const { lngPost }  = -90;
  const {latPost }  = 30;
  // const  lngRounded = Math.round(lng * 10000) / 10000;
  // const  latRounded = Math.round(lat * 10000) / 10000;
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
      const { data } = await axios.post(`/api/home/create-post/${1}`, {
        options: {
          longitude: lngPost,
          latitude: latPost,
          isCostume,
          isThrow
        }
      })
      console.log('Post sent to database')
    } catch (err)  {
      console.error(err)
    }
  }

  // const savePhotoPost = async () => {
  //   try{
  //     const { data } = await axios.post(`/api/pins/create-pin/${1}`, {
  //       options: {
  //         longitude: lng,
  //         latitude: lat,
  //         isToilet,
  //         isFood,
  //         isPersonal,
  //         isFree,
  //       }
  //     })
  //     console.log('whish! pin sent to database')
  //     setMarkers(markers.concat([data]))
  //   } catch (err)  {
  //     console.error(err)
  //   }
  // }


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
              <Form.Label>Add a picture below!</Form.Label>
              <Photos latPost={latPost} lngPost={lngPost} createPhoto={createPhoto}/>
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