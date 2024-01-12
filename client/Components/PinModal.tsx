import React, {useState, useEffect, useContext} from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import Photos from './Photos'
import CreatePinMap from './CreatePinMap'
import { ThemeContext } from './Context'
interface Props {
  setShowModal: any
  markers: any
  setMarkers: any
  isPinSelected: boolean
  setIsPinSelected: any
  selectedPin: any
  userId: number
  userLocation: [number, number]
}

const PinModal: React.FC<Props> = ( {userId, setShowModal, selectedPin, markers, setMarkers, isPinSelected, setIsPinSelected, userLocation} ) => {
  const theme = useContext(ThemeContext)
  const [isShow, setShow] = useState(true);
  const [isToilet, setIsToilet] =useState(false);
  const [isFood, setIsFood] =useState(false);
  const [isPersonal, setIsPersonal] =useState(false);
  const [isFree, setIsFree] =useState(false);
  const [isPhoneCharger, setIsPhoneCharger] =useState(false);
  const [isPoliceStation, setIsPoliceStation] =useState(false);
  const [isEMTStation, setIsEMTStation] =useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPhoto, setShowPhoto] = useState(true);
  //const [marker, setMarkers] = useState([markers]);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const { lng, lat } = params;

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
    setIsPhoneCharger(false)
    setIsPoliceStation(false)
    setIsEMTStation(false)
    setIsPinSelected(false);
  }

  const saveCreatedPin = async () => {
    initModal()

    if (!isPinSelected){
      try{
        const { data } = await axios.post(`/api/pins/create-pin/${userId}`, {
          options: {
            longitude: lng,
            latitude: lat,
            isToilet,
            isFood,
            isPersonal,
            isFree,
            isPhoneCharger,
            isPoliceStation,
            isEMTStation
          }
        })
        console.log('whish! pin sent to database')
        setMarkers(markers.concat([data]))
      } catch (err)  {
        console.error(err)
      }
    }
  }

  const pinCategory = (category: string) => {

    const categoryMapping: PinCategoryMapping = {
      isFree:"Free Toilet",
      isToilet: "Pay for Toilet",
      isFood: "Food",
      isPersonal: "Personal",
      isPhoneCharger: 'Phone Charger',
      isPoliceStation: "Police Post",
      isEMTStation:"EMT Station"
    }

    return categoryMapping[category]
  }


  return (
    <>
    { isPinSelected
    ? (
      <Modal className={theme} show={isShow} onHide={initModal}>
          <Modal.Header id="modal-header" closeButton onClick={initModal}>
            <Modal.Title > {pinCategory(selectedPin[0].pinCategory)} Pins</Modal.Title>
          </Modal.Header>
          { showPhoto ? (
          <div>
          <Modal.Body>
            <div id="pin-photos">
                {
                  selectedPin.map((pin: any) => (
                    <div key={pin.id}>
                      <p><b>Submitted by: </b>{pin.firstName} {pin.lastName}</p>
                      <img src={pin.photoURL} alt="Pin Photo" style={{ maxWidth: "100%", height: "auto",  marginTop: "10px"}}/>
                      <br /><p>{pin.description}</p>
                    </div>
                  ))
                }
            </div>
          </Modal.Body>
          <Modal.Footer>
            {/* <ShareModal postId={selectedPin[0].id} userId={1} postType={"pin"}/> */}
            {/* <Button onClick={initModal}> Close </Button> */}
            <Button className="btn" onClick={() => {setShowPhoto(false)}}> Add Photo </Button>
          </Modal.Footer>
          </div>
            ) : (
          <div>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="picture spot" >
            { selectedPin.map((pin: any) => (
            <Photos
            key={pin.id}
            lat={pin.latitude}
            lng={pin.longitude}
            saveCreatedPin={saveCreatedPin}
            latPost={null} lngPost={null} isThrow={null} isCostume={null} createPhoto={null} userId={userId}/>
            ))}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={initModal} > Close </Button>
          </Modal.Footer>
          </div>
              )
            }
        </Modal>
      )
    :
    (
      <Modal show={isShow} onHide={initModal}>
        <Modal.Header id="modal-header" closeButton onClick={initModal}>
          <Modal.Title>Create a Pin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         Drop a pin, select a category, add a picture, and save your pin.
        <CreatePinMap userLocation={userLocation}/>
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
              <Form.Check type="radio" id="PhoneCharger" name="pin-cat"
                label="Charging Station" value="PhoneCharger" inline isValid
                onClick={() => {resetBooleanState(); setIsPhoneCharger(!isPhoneCharger)} }
              />
              <Form.Check type="radio" id="PoliceStation" name="pin-cat"
                label="Police Station" value="PoliceStation" inline isValid
                onClick={() => {resetBooleanState(); setIsPoliceStation(!isPoliceStation)} }
              />
              <Form.Check type="radio" id="EMT Station" name="pin-cat"
                label="EMT Station" value="EMT Station" inline isValid
                onClick={() => {resetBooleanState(); setIsEMTStation(!isEMTStation)} }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="picture spot" >
              <Photos
              lng={lng}
              lat={lat}
              saveCreatedPin={saveCreatedPin}
              latPost={null}
              lngPost={null}
              isThrow={null}
              isCostume={null}
              createPhoto={null}
              userId={userId} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        {/* <Button onClick={initModal}> Close </Button> */}
        </Modal.Footer>
      </Modal>)
      }
    </>
  )
}

interface PinCategoryMapping {
  [key: string]: string;
  isFree: string;
  isToilet: string;
  isFood: string;
  isPersonal: string;
  isPhoneCharger: string;
  isPoliceStation: string;
  isEMTStation: string;
}

export default PinModal;