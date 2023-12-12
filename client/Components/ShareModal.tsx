import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";
import UserPage from "./UserPage";

const ShareModal = (props: { post: any; userId: number; postType: string }) => {
  const { post, userId, postType } = props;

  const [show, setShow] = useState(false);
  const [friends, setFriends] = useState([]);
  const [shareId, setShareId] = useState(null);

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
    getFriends();
  }, []);

  const sharePost = async (share: string) => {
    try {
      await axios.post(`api/home/share/${share}`, {
        recipient_userId: shareId,
        sender_userId: userId,
        id: post.id,
      });
    } catch (err) {
      console.error(err);
    } finally {
      handleClose();
    }
  };

  return (
    <div>
      <Button
        onClick={handleShow}
      >
        SHARE
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Post</Modal.Title>
        </Modal.Header>

        <Form>
          <DropdownButton
            id="dropdown-basic-button"
            title="KREWE"
          >
            {friends.map((friend, index) => (
              <Dropdown.Item key={`${friend.lastName} + ${index}`} onSelect={() => setShareId(friend.id)}>
                {friend.firstName} {friend.lastName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Form>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => sharePost(postType)}
          >
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShareModal;
