import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

const PostCard = (props: { post: any }) => {
  const { post } = props;
  return (
    <div>
      {post.comment ? (
        <Card>
          <Card.Text>
            `${post.comment} - ${post.createdAt}`
          </Card.Text>{" "}
        </Card>
      ) : (
        <Card>
          <Card.Img
            variant="top"
            src={post.photoURL}
          />
          <Card.Text>
            `${post.description} - ${post.createdAt}`
          </Card.Text>{" "}
        </Card>
      )}
    </div>
  );
};

export default PostCard;
