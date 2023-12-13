import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";

import ShareModal from "./ShareModal";

dayjs.extend(relativeTime);

const PostCard = (props: { post: any; userId: number }) => {
  const { post, userId } = props;
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

  const handleUpvote = () => {
    console.log('great job!');
  }

  
  const handleDownvote = () => {
    console.log('BOOO!!!');
  }

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <Card>
      {post.comment ? (
        <Card.Body>
          <Card.Text>
            {post.comment} - {owner}:{" "}
            {dayjs(post.createdAt.toString()).fromNow()}
          </Card.Text>
          <ShareModal
            post={post}
            userId={userId}
            postType={"comment"}
          />
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
          <ShareModal
            post={post}
            userId={userId}
            postType={"photo"}
          />
        </Card.Body>
      )}
      <Button onClick={handleUpvote}>Upvote</Button>
      <Button onClick={handleDownvote}>Downvote</Button>
    </Card>
  );
};

export default PostCard;
