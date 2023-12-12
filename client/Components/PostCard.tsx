import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";

dayjs.extend(relativeTime);

const PostCard = (props: { post: any, userId: number }) => {
  const { post, userId } = props;
  const [owner, setOwner] = useState("");

  const sharePost = async (share: string) => {
    try {
      await axios.post(`api/home/share/${share}`, {
        recipient_userId: 1,
        sender_userId: userId,
        id: post.id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getOwner = async () => {
    try {
      const { data } = await axios.get(`api/home/post/${post.ownerId}`);
      //TODO: change to name
      setOwner(data.email);
    } catch (err) {
      console.error(err);
    }
  };
  getOwner();

  return (
    <Card>
      {post.comment ? (
        <Card.Body>
          <Card.Text>
            {post.comment} - {owner}:{" "}
            {dayjs(post.createdAt.toString()).fromNow()}
          </Card.Text>
          <Button
                variant="error"
                onClick={() => sharePost('comment')}
              >
                SEND!!!
              </Button>
        </Card.Body>
      ) : (
        <Card.Body>
          <Card.Img
            variant="top"
            src={post.photoURL}
          />
          <Card.Text>
            {post.description} - {owner}:{" "}
            {dayjs(post.createdAt.toString()).fromNow()}
          </Card.Text>
          <Button
                variant="error"
                onClick={() => sharePost('photo')}
              >
                SEND!!!
              </Button>
        </Card.Body>
      )}
    </Card>
  );
};

export default PostCard;
