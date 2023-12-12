import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";

dayjs.extend(relativeTime);

const PostCard = (props: { post: any }) => {
  const { post } = props;
  const [owner, setOwner] = useState("");

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
    <div>
      {post.comment ? (
        <Card>
          <Card.Text>
            {post.comment} - {owner}:{" "}
            {dayjs(post.createdAt.toString()).fromNow()}
          </Card.Text>
        </Card>
      ) : (
        <Card>
          <Card.Img
            variant="top"
            src={post.photoURL}
          />
          <Card.Text>
            {post.description} - {owner}:{" "}
            {dayjs(post.createdAt.toString()).fromNow()}
          </Card.Text>
        </Card>
      )}
    </div>
  );
};

export default PostCard;
