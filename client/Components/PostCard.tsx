import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import axios from "axios";

dayjs.extend(relativeTime);

const PostCard = (props: { post: any }) => {
  const { post } = props;
  return (
    <div>
      {post.comment ? (
        <Card>
          <Card.Text>
            {post.comment} - {dayjs(post.createdAt.toString()).fromNow()}
          </Card.Text>
        </Card>
      ) : (
        <Card>
          <Card.Img
            variant="top"
            src={post.photoURL}
          />
          <Card.Text>
            {post.description} - {dayjs(post.createdAt.toString()).fromNow()}
          </Card.Text>
        </Card>
      )}
    </div>
  );
};

export default PostCard;
