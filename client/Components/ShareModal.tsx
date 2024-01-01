import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { IoIosSend } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShareModal = (props: {
  postId: number;
  userId: number;
  postType: string;
}) => {
  const { postId, userId, postType } = props;

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
      await axios.post(`api/home/share/${share}`, {
        recipient_userId: shareId,
        sender_userId: userId,
        id: postId,
      });
      toast('🎭Post shared successfully!🎭', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (err) {
      console.error(err);
    } finally {
      handleClose();
    }
  };

  return (
    <div >
      <Button onClick={handleShow} style={{ marginLeft: '150px'}}>
        <IoIosSend />
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Post</Modal.Title>
        </Modal.Header>

        <Form>
          <DropdownButton title={friendName || 'Krewe'}>
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
