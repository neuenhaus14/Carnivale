import React, { useState, useEffect } from "react";
import { ButtonGroup, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ShareModal from "./ShareModal";
// import {IoMdArrowUp} from "@react-icons/all-files/io/IoMdArrowUp";
// import {IoMdArrowDown} from "@react-icons/all-files/io/IoMdArrowDown";
import {IoArrowDownCircle} from '@react-icons/all-files/io5/IoArrowDownCircle';
import {IoArrowUpCircle} from '@react-icons/all-files/io5/IoArrowUpCircle';

dayjs.extend(relativeTime);

interface Post {
  id: number;
  comment?: string;
  ownerId: number;
  photoURL?: string;
  description?: string;
  createdAt: string;
  upvotes: number;
}

interface PostCardProps {
  post: Post;
  userId: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, userId }) => {
  const [owner, setOwner] = useState("");
  const [commentVotingStatus, setCommentVotingStatus] = useState<
    "upvoted" | "downvoted" | "none"
  >("none");
  const [isOwner, setIsOwner] = useState(false);

  const getOwner = async () => {
    try {
      const { data } = await axios.get(`api/home/post/${post.ownerId}`);
      setOwner(data.firstName + " " + data.lastName);
      setIsOwner(data.id === userId);
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

      if (commentVotingStatus !== "upvoted") {
        setCommentVotingStatus("upvoted");
      }
    } catch (err) {
      toast.warning("You've already upvoted this post!");
    }
  };

  const handleDownvote = async (type: string) => {
    try {
      await axios.post(
        `/api/feed/${
          type === "comment"
            ? `downvote-comment/${userId}/${post.id}`
            : `downvote-photo/${userId}/${post.id}`
        }`
      );

      if (commentVotingStatus !== "downvoted") {
        setCommentVotingStatus("downvoted");

        if (post.upvotes - 1 <= -5) {
          toast.error("Post deleted due to too many downvotes!");
        }
      }
    } catch (err) {
      toast.warning("You've already downvoted this post!");
    }
  };

  useEffect(() => {
    getOwner();
  }, []);

  const handleDeletePost = async (type: string) => {
    try {
      if (isOwner) {
        await axios.delete(
          `/api/home/${
            type === "comment"
              ? `delete-comment/${post.id}`
              : `delete-photo/${post.id}`
          }`,
          {
            data: { userId },
          }
        );
        toast.success("Post deleted successfully!");
      } else {
        toast.error("You are not the owner of this post. Delete not allowed.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post. Please try again.");
    }
  };

  return (
    <>
      <Card>
        {post.comment ? (
          <Card.Body>
            <Card.Text as="div">
              <p className="card-content">{post.comment}</p>
              <p className="card-detail">
                {owner} posted
                <br />
                <>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${post.id}`}>
                        {dayjs(post.createdAt.toString()).format(
                          "dddd [at] h:mm A"
                        )}
                      </Tooltip>
                    }
                  >
                    <span style={{ cursor: "pointer" }}>
                      {dayjs(post.createdAt.toString()).fromNow()}
                    </span>
                  </OverlayTrigger>
                </>
                {/* {dayjs(post.createdAt.toString()).fromNow()} */}
              </p>
            </Card.Text>
            <ButtonGroup
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "-6px",
              }}
            >
              <button
                style={{
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "none",
                  background: "transparent",
                }}
                onClick={() => handleUpvote("comment")}
                disabled={commentVotingStatus === "upvoted"}
              >
                <IoArrowUpCircle
                  style={{
                    color:
                      commentVotingStatus === "upvoted" ? "green" : "black",
                    fontSize: "30px",
                  }}
                />
              </button>
              <span style={{ margin: "0 5px" }}>{post.upvotes}</span>
              <button
                style={{
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "none",
                  background: "transparent",
                }}
                onClick={() => handleDownvote("comment")}
                disabled={commentVotingStatus === "downvoted"}
              >
                <IoArrowDownCircle
                  style={{
                    color:
                      commentVotingStatus === "downvoted" ? "red" : "black",
                    fontSize: "30px",
                  }}
                />
              </button>
              {isOwner && (
                <button
                  style={{
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: "none",
                    background: "transparent",
                    color: "red",
                  }}
                  onClick={() => handleDeletePost("comment")}
                >
                  Delete
                </button>
              )}
              <div style={{ marginLeft: "auto" }}>
                <ShareModal
                  postId={post.id}
                  userId={userId}
                  postType={"comment"}
                />
              </div>
            </ButtonGroup>
          </Card.Body>
        ) : (
          <Card.Body>
            <Card.Img variant="top" src={post.photoURL} />
            <Card.Text as='div'>
              <p className="card-content">{post.description}</p>
              <div className="card-detail">
                {owner} posted
                <div>
                  {/* {' '} */}
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${post.id}`}>
                        {dayjs(post.createdAt.toString()).format(
                          "dddd [at] h:mm A"
                        )}
                      </Tooltip>
                    }
                  >
                    <span style={{ cursor: "pointer" }}>
                      {dayjs(post.createdAt.toString()).fromNow()}
                    </span>
                  </OverlayTrigger>
                </div>
                {/* {dayjs(post.createdAt.toString()).fromNow()} */}
              </div>
            </Card.Text>
            <ButtonGroup
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "-6px",
              }}
            >
              <button
                style={{
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "none",
                  background: "transparent",
                }}
                onClick={() => handleUpvote("photo")}
                disabled={commentVotingStatus === "upvoted"}
              >
                <IoArrowUpCircle
                  style={{
                    color:
                      commentVotingStatus === "upvoted" ? "green" : "black",
                    fontSize: "30px",
                  }}
                />
              </button>
              <span style={{ margin: "0 5px" }}>{post.upvotes}</span>
              <button
                style={{
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "none",
                  background: "transparent",
                }}
                onClick={() => handleDownvote("photo")}
                disabled={commentVotingStatus === "downvoted"}
              >
                <IoArrowDownCircle
                  style={{
                    color:
                      commentVotingStatus === "downvoted" ? "red" : "black",
                    fontSize: "30px",
                  }}
                />
              </button>
              {isOwner && (
                <button
                  style={{
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: "none",
                    background: "transparent",
                    color: "red",
                  }}
                  onClick={() => handleDeletePost("photo")}
                >
                  Delete
                </button>
              )}
              <div style={{ marginLeft: "auto" }}>
                <ShareModal
                  postId={post.id}
                  userId={userId}
                  postType={"photo"}
                />
              </div>
            </ButtonGroup>
          </Card.Body>
        )}
      </Card>

      {/* Toast containers */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default PostCard;
