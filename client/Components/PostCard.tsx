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

  const handleUpvote = async (type: string) => {
    try {
      await axios.post(
        `/api/feed/${
          type === "comment"
            ? `upvote-comment/${userId}/${post.id}`
            : `upvote-photo/${userId}/${post.id}`
        }`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async (type: string) => {
    try {
      console.log(`great job:${post.id}`);
      await axios.post(
        `/api/feed/${
          type === "comment"
            ? `downvote-comment/${userId}/${post.id}`
            : `downvote-photo/${userId}/${post.id}`
        }`
      );
    } catch (err) {
      console.error(err);
    }
    console.log(`Boo:${post.id}`);
  };

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
            postId={post.id}
            userId={userId}
            postType={"comment"}
          />
          Upvotes: {post.upvotes}
          <Button onClick={() => handleUpvote("comment")}>Upvote</Button>
          <Button onClick={() => handleDownvote("comment")}>Downvote</Button>
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
            postId={post.id}
            userId={userId}
            postType={"photo"}
          />
          Upvotes: {post.upvotes}
          <Button onClick={() => handleUpvote("photo")}>Upvote</Button>
          <Button onClick={() => handleDownvote("photo")}>Downvote</Button>
        </Card.Body>
      )}
    </Card>
  );
};

export default PostCard;
