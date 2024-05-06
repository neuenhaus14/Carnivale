import React, {useState, useContext, useEffect} from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify';
import { Popup } from 'react-map-gl';
import axios from 'axios'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import Photos from './Photos'
import CreatePinMap from './CreatePinMap'
import { MdDelete } from '@react-icons/all-files/md/MdDelete';
import { IoArrowDownCircle } from '@react-icons/all-files/io5/IoArrowDownCircle';
import { IoArrowUpCircle } from '@react-icons/all-files/io5/IoArrowUpCircle';
import { ThemeContext, RunModeContext } from './Context'

interface Props {
  setShowModal: any
  markers: any
  setMarkers: any
  isPinSelected: boolean
  setIsPinSelected: any
  selectedPin: any
  setSelectedPin: any
  userId: number
  userLocation: [number, number]
  setConfirmActionBundle: any
  getPins: any
}

const PinModal: React.FC<Props> = ( {userId, setShowModal, selectedPin, setSelectedPin, markers, setMarkers, isPinSelected, setIsPinSelected, userLocation, setConfirmActionBundle, getPins} ) => {
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
  const [commentVotingStatus, setCommentVotingStatus] = useState<
  'upvoted' | 'downvoted' | 'none'
>('none');

  const isDemoMode = useContext(RunModeContext) === 'demo';

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

  const handleDeletePinPic = async (photo) => {
    if (isDemoMode) {
      toast.success('Delete your post!');
    } else {
      try {
        const response= await axios.delete(`/api/pins/delete-photo/${photo.id}`, {
          data: {userId: photo.ownerId, lat: photo.latitude, lng: photo.longitude },
        });
        console.log('response', response)
        toast.success('Post deleted successfully!');
        getPins();
       
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Error deleting post. Please try again.');
      }
    }
  }

  // handle the upvotes on the pin PHOTO. Can't use upvotes on Pin bc there are multiple pics on each Pin...
  // the selectedPin on pin param is the photo id. So we are passing in the Pin but calling it photo to be ~clear
  const handleUpvote = async (photo) => { 
    // if demo mode, display toast
    if (isDemoMode) {
      toast('🎭 Post upvoted! 🎭', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    // else run upvote logic
    else {
      try {
        await axios.post(`/api/feed/upvote-photo/${userId}/${photo.id}`); //218 Feed.ts
        if (commentVotingStatus !== 'upvoted') {
          setCommentVotingStatus('upvoted');
          updateSelectedPhotoVotes(photo);
        }
      } catch (err) {
        toast.warning("You've already upvoted this post!");
      } 
    }
  };

  
  // handle the upvotes on the pin PHOTO. Can't use upvotes on Pin bc there are multiple pics on each Pin...
  const handleDownvote = async (photo) => {
    // if demo mode, display toast
    if (isDemoMode) {
      toast('🎭 Post downvoted! 🎭', {
        position: 'top-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    // if not demo mode, run downvote logic
    else {
      try {
        await axios.post(`/api/feed/downvote-photo/${userId}/${photo.id}`); //392 Feed.ts
        if (commentVotingStatus !== 'downvoted') {
          setCommentVotingStatus('downvoted');
          updateSelectedPhotoVotes(photo);

          if (photo.upvotes - 1 <= -5) {
            toast.error('Post deleted due to too many downvotes!');
          }
        }
      } catch (err) {
        toast.warning("You've already downvoted this post!");
      } 
    }
  };


  // after up or downvote, get request gets the updated pin/photo and updates selectedPin with new vote count
  const updateSelectedPhotoVotes = async (photo: any) => {
    try {
      const { data } = await axios.get(`/api/pins/get-pin-photo/${photo.id}`);
      
      data.forEach((pinPhoto) => {
        selectedPin.forEach((pin) => {
          if (pinPhoto.id === pin.id){
            pin.upvotes = pinPhoto.upvotes
          }
        });
        setSelectedPin((prevPin) => [...prevPin]);
      });
      
    } catch (err) {
      console.error(err);
    }
  };

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
                    <div key={pin.id} className="pin-post-card">
                      <div className="post-card-sender">Via {pin.firstName} {pin.lastName}<br/>
                      <i>{dayjs(pin.createdAt.toString()).format('ddd, MMM D, YYYY h:mm A')}</i></div>
                      <div className="pin-post-card-image"><img src={pin.photoURL} alt="Pin Photo" style={{ maxWidth: "100%", height: "auto",  marginTop: "10px"}}/></div>
                      <div className="post-card-buttons">
                        <div className="post-card-content">{pin.description}</div>
                        {pin.ownerId === userId && (
                          <Button
                            className='post-card-delete-button'
                            variant='danger'
                            onClick={ isDemoMode? null : async () => {
                              await setConfirmActionBundle.setConfirmActionFunction(
                                () => async () => { await handleDeletePinPic(pin); });
                              await setConfirmActionBundle.setConfirmActionText('delete your contribution');
                              await setConfirmActionBundle.setShowConfirmActionModal(true);
                            }}
                          ><MdDelete />
                          </Button>
                        )}
                        <div className='vote-buttons-container d-flex flex-row align-items-center'>
                          <Button
                            variant='outline-success'
                            className='vote-button rounded-circle'
                            onClick={() => {handleUpvote(pin)}}
                            disabled={commentVotingStatus === 'upvoted'}
                          >
                            <IoArrowUpCircle
                              style={{color: commentVotingStatus === 'upvoted' ? 'green' : 'black', fontSize: '25px', }} />
                          </Button>
                          <span className='mx-2'>{pin.upvotes}</span>
                          <Button
                            variant='outline-danger'
                            className='vote-button rounded-circle'
                            onClick={() => handleDownvote(pin)}
                            disabled={commentVotingStatus === 'downvoted'}
                          >
                            <IoArrowDownCircle
                              style={{
                                color:
                                  commentVotingStatus === 'downvoted' ? 'red' : 'black',
                                fontSize: '25px',
                              }}
                            />
                          </Button>
                        </div>
                      </div>
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
            </div>
                )
              }
        </Modal>
      )
    :
    ( 
      <Modal className={theme} show={isShow} onHide={initModal}>
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
                label="Pay Toilet" value="isToilet" inline isValid
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
                label="Phone Charger" value="PhoneCharger" inline isValid
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
        <Modal.Footer id="modal-footer">
        {/* <Button onClick={initModal}> Close </Button> */}
        </Modal.Footer>
      </Modal>)
      }
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme='light'
      />
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