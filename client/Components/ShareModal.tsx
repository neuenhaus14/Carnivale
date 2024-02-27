import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaShareSquare } from '@react-icons/all-files/fa/FaShareSquare';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext, RunModeContext } from './Context';

const ShareModal = (props: {
  postId: number;
  userId: number;
  postType: string;
}) => {
  const { postId, userId, postType } = props;

  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';

  const [show, setShow] = useState(false);
  const [friends, setFriends] = useState([]);
  const [shareId, setShareId] = useState(null);
  const [friendName, setFriendName] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`);
      setFriends(friends.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId !== null) {
      getFriends();
    }
  }, [userId]);

  const sharePost = async (share: string) => {
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
        await axios.post(`api/home/share/${share}`, {
          recipient_userId: shareId,
          sender_userId: userId,
          id: postId,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleClose();
    }
  };

  return (
    <div className={theme}>
      <Button onClick={handleShow} style={{ marginLeft: '150px' }}>
        <FaShareSquare />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Share Post</Modal.Title>
        </Modal.Header>

        <Form>
          <DropdownButton
            id='share-modal-dropdown'
            title={friendName || 'Krewe'}
          >
            {friends.map((friend, index) => {
              const name = `${friend.firstName} ${friend.lastName}`;
              return (
                <Dropdown.Item
                  key={`${friend.lastName} + ${index}`}
                  onClick={() => {
                    setShareId(friend.id);
                    setFriendName(name);
                  }}
                >
                  {name}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </Form>

        <Modal.Footer>
          <Button
            id='share-modal-button'
            variant='primary'
            onClick={() => sharePost(postType)}
            disabled={!shareId}
          >
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShareModal;
