import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaShareSquare } from '@react-icons/all-files/fa/FaShareSquare';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext, RunModeContext, ContentFunctionsContext, UserContext } from './Context';

import ShareContent from './ShareContent';

interface ShareModalProps{

}

const ShareModal:React.FC<ShareModalProps> = () => {


  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';
  const {setShareModalBundle} = useContext(ContentFunctionsContext);
  const {user}  = useContext(UserContext);

  const [friendsToShareWith, setFriendsToShareWith] = useState<number[]>([]); // just ids here

  const toggleShowShareModal = () => setShareModalBundle.setShowShareModal(!setShareModalBundle.showShareModal);

  const sharePost = async () => {
    try {
      if (isDemoMode) {
        toast('🎭 Post shared! 🎭', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        await axios.post(`api/sharedContent/addSharedContentArray`, {
          friendsToShareWith,
          contentId: setShareModalBundle.postToShare.content.id,
          senderId: user.id,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      toggleShowShareModal();
    }
  };

  const toggleFriendToShareWith = (e: any) => {
    const { value } = e.target;

    if (!friendsToShareWith.includes(value)) {
      setFriendsToShareWith([...friendsToShareWith, value]);
    } else if (friendsToShareWith.includes(value)) {
      setFriendsToShareWith(
        friendsToShareWith.filter((friendId) => friendId !== value)
      );
    }
  };

  return (
    <Modal
      className={`${theme}`}
      show={setShareModalBundle.showShareModal}
      onHide={toggleShowShareModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Share Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {setShareModalBundle.post}
        </div>
       <ShareContent toggleFriendToShareWith={toggleFriendToShareWith}/>
      </Modal.Body>
      <Modal.Footer className='d-flex justify-content-center'>
        <Button
          id='share-modal-button'
          variant='primary'
          onClick={() => sharePost()}
          disabled={!setShareModalBundle.postToShare}
        >
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
