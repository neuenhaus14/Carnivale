import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

const PostCard = (props: { post: any; }) => {
  const { post } = props;
  return (
    <div>
      <Card>
        {
          post.comment
          ?`${post.comment} - ${post.createdAt}`
          :`${post.photoURL} - ${post.createdAt}`
        }
      </Card>
    </div>
  );
};

export default PostCard;
