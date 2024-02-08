import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { IoArrowDownCircle } from "@react-icons/all-files/io5/IoArrowDownCircle";
import { IoArrowUpCircle } from "@react-icons/all-files/io5/IoArrowUpCircle";
import { BiHide } from "@react-icons/all-files/bi/BiHide";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Container,
  OverlayTrigger,
  Tooltip,
  Card,
  Modal,
} from "react-bootstrap";
import { ThemeContext } from "./Context";
import ConfirmActionModal from "./ConfirmActionModal";

interface SharedPost {
  upvotes: number;
  id: number;
  sender_userId: number;
  recipient_userId: number;
  shared_commentId: number | null;
  shared_pinId: number | null;
  shared_photoId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface Comment {
  comment: string;
  ownerId: number;
  upvotes: number;
}

// interface Pin {
//   ownerId: number;
//   isToilet: boolean;
//   isFood: boolean;
//   isPersonal: boolean;
//   upvotes: number;
// }

interface Photo {
  description: string;
  ownerId: number;
  upvotes: number;
  url: string;
}

interface FeedPageProps {
  userId: number;
}

const FeedPage: React.FC<FeedPageProps> = ({ userId }) => {
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userNames, setUserNames] = useState<{ [userId: number]: string }>({});
  const [commentDetails, setCommentDetails] = useState<{
    [postId: number]: Comment;
  }>({});
  // const [pinDetails, setPinDetails] = useState<{ [postId: number]: Pin }>({});
  const [photoDetails, setPhotoDetails] = useState<{ [postId: number]: Photo }>(
    {}
  );
  const [deletedPosts, setDeletedPosts] = useState<number[]>([]);
  const theme = useContext(ThemeContext);

  const fetchSenderName = async (userId: number) => {
    try {
      const response = await axios.get(`/api/feed/user/${userId}`);
      const senderName = `${response.data.firstName} ${response.data.lastName}`;
      setUserNames((prevNames) => ({ ...prevNames, [userId]: senderName }));
    } catch (error) {
      console.error(`Error fetching sender ${userId} information:`, error);
    }
  };

  const [commentVotingStatus, setCommentVotingStatus] = useState<{
    [commentId: number]: "upvoted" | "downvoted" | "none";
  }>({});

  const [photoVotingStatus, setPhotoVotingStatus] = useState<{
    [photoId: number]: "upvoted" | "downvoted" | "none";
  }>({});

  const [pinVotingStatus, setPinVotingStatus] = useState<{
    [pinId: number]: "upvoted" | "downvoted" | "none";
  }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const [showAboutModal, setShowAboutModal] = useState(true);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, userResponse] = await Promise.all([
          // axios.get(`/api/feed/shared-posts/${userId}`),
          // axios.get(`/api/feed/user/${userId}`),
          // Swap top and bottom comments for testing
          axios.get(`/api/feed/shared-posts/1`),
          axios.get(`/api/feed/user/1`),
        ]);

        setSharedPosts(postsResponse.data);
        setCurrentUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchDetails = async (postId: number, type: string) => {
      try {
        const response = await axios.get(`/api/feed/shared-${type}/${postId}`);

        if (response.data === null) {
          if (type === "comment") {
            setCommentDetails((prevDetails) => ({
              ...prevDetails,
              [postId]: null,
            }));
            // } else if (type === "pin") {
            //   setPinDetails((prevDetails) => ({
            //     ...prevDetails,
            //     [postId]: null,
            //   }));
          } else if (type === "photo") {
            setPhotoDetails((prevDetails) => ({
              ...prevDetails,
              [postId]: null,
            }));
          }
          {
            toast.error("Post deleted due to too many downvotes!");
          }
          setTimeout(() => {
            window.location.reload();
          }, 5000);

          return;
        }

        const details = {
          comment: {
            comment: response.data.comment,
            ownerId: response.data.ownerId,
            upvotes: response.data.upvotes,
          },
          // pin: {
          //   ownerId: response.data.ownerId,
          //   isToilet: response.data.isToilet,
          //   isFood: response.data.isFood,
          //   isPersonal: response.data.isPersonal,
          //   upvotes: response.data.upvotes,
          // },
          photo: {
            description: response.data.description,
            ownerId: response.data.ownerId,
            upvotes: response.data.upvotes,
            url: response.data.photoURL,
          },
        };

        if (type === "comment") {
          setCommentDetails((prevDetails) => ({
            ...prevDetails,
            [postId]: details.comment,
          }));
          // } else if (type === "pin") {
          //   setPinDetails((prevDetails) => ({
          //     ...prevDetails,
          //     [postId]: details.pin,
          //   }));
        } else if (type === "photo") {
          setPhotoDetails((prevDetails) => ({
            ...prevDetails,
            [postId]: details.photo,
          }));
        }

        // Fetch user details if not already fetched
        if (!userNames[response.data.ownerId]) {
          const userResponse = await axios.get(
            `/api/feed/user/${response.data.ownerId}`
          );
          setUserNames((prevNames) => ({
            ...prevNames,
            [response.data
              .ownerId]: `${userResponse.data.firstName} ${userResponse.data.lastName}`,
          }));
        }
      } catch (error) {
        console.error(`Error fetching ${type} details:`, error);
      }
    };
    const fetchDataDetails = async () => {
      const fetchPromises: Promise<void>[] = [];

      sharedPosts.forEach((post) => {
        if (post.sender_userId && !userNames[post.sender_userId]) {
          fetchPromises.push(fetchSenderName(post.sender_userId));
        }

        if (post.shared_commentId) {
          fetchPromises.push(fetchDetails(post.shared_commentId, "comment"));
        }

        // if (post.shared_pinId) {
        //   fetchPromises.push(fetchDetails(post.shared_pinId, "pin"));
        // }

        if (post.shared_photoId) {
          fetchPromises.push(fetchDetails(post.shared_photoId, "photo"));
        }
      });

      try {
        await Promise.all(fetchPromises);
      } catch (error) {
        console.error(`Error in Promise.all:`, error);
      }
    };

    fetchDataDetails();
  }, [sharedPosts, userNames, userNames]);

  const handleUpvote = async (postId: number, type: string) => {
    // try {
    //   await axios.post(
    //     `/api/feed/${
    //       type === 'comment'
    //         ? `upvote-comment/${userId}/${postId}`
    //         : type === 'pin'
    //         ? `upvote-pin/${userId}/${postId}`
    //         : `upvote-photo/${userId}/${postId}`
    //     }`
    //   );

    //   // Update the voting status based on the type
    //   if (type === 'comment') {
    //     setCommentVotingStatus((prev) => ({ ...prev, [postId]: 'upvoted' }));
    //   } else if (type === 'pin') {
    //     setPinVotingStatus((prev) => ({ ...prev, [postId]: 'upvoted' }));
    //   } else if (type === 'photo') {
    //     setPhotoVotingStatus((prev) => ({ ...prev, [postId]: 'upvoted' }));
    //   }

    //   // Fetch updated post details
    //   await fetchPostDetails(postId, type);

    //   // Update the state using functional updates
    //   setSharedPosts((prevSharedPosts) =>
    //     prevSharedPosts.map((post) =>
    //       post.id === postId
    //         ? {
    //             ...post,
    //             upvotes: post.upvotes + 1,
    //           }
    //         : post
    //     )
    //   );
    // } catch (error) {
    //   toast.warning("You've already upvoted this post!");
    // }
    toast("🎭Upvote post!🎭", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleDownvote = async (postId: number, type: string) => {
    // try {
    //   await axios.post(
    //     `/api/feed/${
    //       type === 'comment'
    //         ? `downvote-comment/${userId}/${postId}`
    //         : type === 'pin'
    //         ? `downvote-pin/${userId}/${postId}`
    //         : `downvote-photo/${userId}/${postId}`
    //     }`
    //   );

    //   // Update the voting status based on the type
    //   if (type === 'comment') {
    //     setCommentVotingStatus((prev) => ({ ...prev, [postId]: 'downvoted' }));
    //   } else if (type === 'pin') {
    //     setPinVotingStatus((prev) => ({ ...prev, [postId]: 'downvoted' }));
    //   } else if (type === 'photo') {
    //     setPhotoVotingStatus((prev) => ({ ...prev, [postId]: 'downvoted' }));
    //   }

    //   // Fetch updated post details
    //   await fetchPostDetails(postId, type);

    //   // Update the state using functional updates
    //   setSharedPosts((prevSharedPosts) =>
    //     prevSharedPosts.map((post) =>
    //       post.id === postId
    //         ? {
    //             ...post,
    //             upvotes: post.upvotes - 1,
    //           }
    //         : post
    //     )
    //   );

    //   // Check if the post has reached -5 upvotes
    //   const updatedUpvotes = sharedPosts
    //     .map((post) =>
    //       post.id === postId ? { ...post, upvotes: post.upvotes - 1 } : post
    //     )
    //     .find((post) => post.id === postId)?.upvotes;

    //   if (updatedUpvotes === -5) {
    //     setDeletedPosts((prevDeletedPosts) => [...prevDeletedPosts, postId]);
    //     // Show deletion toast
    //     toast.error(`Post deleted due to too many downvotes: ID ${postId}`);
    //     // Delay the page refresh by 2 seconds
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 2000);
    //   }
    // } catch (error) {
    //   toast.warning("You've already downvoted this post!");
    // }
    toast("Downvote post!🎭", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const fetchPostDetails = async (postId: number, type: string) => {
    try {
      if (!sharedPosts.some((post) => post.id === postId)) {
        return;
      }

      if (type === "comment") {
        const response = await axios.get(`/api/feed/shared-comment/${postId}`);

        if (response.data !== null) {
          setCommentDetails((prevDetails) => ({
            ...prevDetails,
            [postId]: {
              comment: response.data.comment,
              ownerId: response.data.ownerId,
              upvotes: response.data.upvotes,
            },
          }));
        } else {
          console.error(`Error: Comment with ID ${postId} not found.`);
        }
        // } else if (type === "pin") {
        //   const response = await axios.get(`/api/feed/shared-pin/${postId}`);
        //   setPinDetails((prevDetails) => ({
        //     ...prevDetails,
        //     [postId]: {
        //       ownerId: null,
        //       isToilet: null,
        //       isFood: null,
        //       isPersonal: null,
        //       upvotes: null,
        //     },
        //   }));
      } else if (type === "photo") {
        const response = await axios.get(`/api/feed/shared-photo/${postId}`);
        setPhotoDetails((prevDetails) => ({
          ...prevDetails,
          [postId]: {
            description: null,
            ownerId: null,
            upvotes: null,
            url: null,
          },
        }));
      }
    } catch (error) {
      console.error(
        `Error fetching updated details for ${type} with ID ${postId}:`,
        error
      );
    }
  };

  const handleDelete = async (postId: number) => {
    // try {
    //   await axios.delete(`/api/feed/shared-posts/${postId}`);

    //   setSharedPosts((prevPosts) =>
    //     prevPosts.filter((post) => post.id !== postId)
    //   );
    // } catch (error) {
    //   console.error(`Error deleting post with ID ${postId}:`, error);
    // }
    toast("🎭Hide post from your feed!🎭", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleShowDeleteModal = (postId: number) => {
    setDeletePostId(postId);
    setShowDeleteModal(true);
  };

  return (
    <Container className={`body ${theme}`}>
      <h1>
        Welcome,{" "}
        {currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : "User"}
        !
      </h1>
      <Modal show={showAboutModal} onHide={toggleAboutModal}>
        <Modal.Header closeButton>
          <Modal.Title>About the Feed Page</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>A curated feed of messages sent directly to you from the home page by your friends. Interact with the votes or hide from your view.</p>
          <p>Take the <a href="https://docs.google.com/forms/d/e/1FAIpQLSfSGLNva3elpadLqpXw1WuD9b4H39lBuX6YMiKT5_o2DNQ7Gg/viewform">Survey</a> and let us know what you think!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleAboutModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {Array.isArray(sharedPosts) && sharedPosts.length > 0 ? (
          sharedPosts.map((post) => (
            <li key={post.id}>
              <div className="card">
                <div style={{ display: "flex", alignItems: "right" }}>
                  <p
                    style={{
                      marginLeft: "auto",
                      lineHeight: ".5",
                      fontSize: "1rem",
                    }}
                  >
                    {userNames[post.sender_userId]} sent you
                  </p>
                </div>

                {post.shared_commentId && (
                  <div style={{ marginTop: "5px" }}>
                    {commentDetails[post.shared_commentId] ? (
                      <Card.Body>
                        <Card.Text as="div">
                          <p className="card-content">
                            {commentDetails[post.shared_commentId].comment}
                          </p>

                          <p className="card-detail">
                            {
                              userNames[
                                commentDetails[post.shared_commentId].ownerId
                              ]
                            }{" "}
                            posted
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
                          </p>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "-10px",
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
                              onClick={() => {
                                handleUpvote(post.shared_commentId, "comment");
                              }}
                              disabled={
                                commentVotingStatus[post.shared_commentId] ===
                                "upvoted"
                              }
                            >
                              <IoArrowUpCircle
                                style={{
                                  color:
                                    commentVotingStatus[
                                      post.shared_commentId
                                    ] === "upvoted"
                                      ? "green"
                                      : "black",
                                  fontSize: "30px",
                                }}
                              />
                            </button>
                            <div style={{ margin: "0 5px", fontSize: "16px" }}>
                              {commentDetails[post.shared_commentId]?.upvotes}
                            </div>
                            <button
                              style={{
                                border: "none",
                                cursor: "pointer",
                                outline: "none",
                                boxShadow: "none",
                                background: "transparent",
                              }}
                              onClick={() => {
                                handleDownvote(
                                  post.shared_commentId,
                                  "comment"
                                );
                              }}
                              disabled={
                                commentVotingStatus[post.shared_commentId] ===
                                "downvoted"
                              }
                            >
                              <IoArrowDownCircle
                                style={{
                                  color:
                                    commentVotingStatus[
                                      post.shared_commentId
                                    ] === "downvoted"
                                      ? "red"
                                      : "black",
                                  fontSize: "30px",
                                }}
                              />
                            </button>
                            <Button
                              style={{
                                border: "none",
                                cursor: "pointer",
                                outline: "none",
                                boxShadow: "none",
                                background: "transparent",
                                marginLeft: "auto",
                              }}
                              onClick={() => handleShowDeleteModal(post.id)}
                            >
                              <BiHide />
                            </Button>
                          </div>
                        </Card.Text>
                      </Card.Body>
                    ) : (
                      post.upvotes <= -5 && (
                        <div>
                          {toast.error(
                            "Post deleted due to too many downvotes!"
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}

                {post.shared_photoId && (
                  <div style={{ marginTop: "5px" }}>
                    {photoDetails[post.shared_photoId] ? (
                      <Card.Body>
                        <Card.Text as="div">
                          <div>
                            <img
                              src={photoDetails[post.shared_photoId].url}
                              alt="Shared Photo"
                              style={{
                                maxWidth: "100%",
                                height: "auto",
                                marginTop: "10px",
                              }}
                            />

                            <p className="card-content">
                              {photoDetails[post.shared_photoId].description}
                            </p>

                            <p className="card-detail">
                              {
                                userNames[
                                  photoDetails[post.shared_photoId].ownerId
                                ]
                              }{" "}
                              posted
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
                            </p>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "-10px",
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
                                onClick={() => {
                                  handleUpvote(post.shared_photoId, "photo");
                                }}
                                disabled={
                                  photoVotingStatus[post.shared_photoId] ===
                                  "upvoted"
                                }
                              >
                                <IoArrowUpCircle
                                  style={{
                                    color:
                                      photoVotingStatus[post.shared_photoId] ===
                                      "upvoted"
                                        ? "green"
                                        : "black",
                                    fontSize: "30px",
                                  }}
                                />
                              </button>
                              <span
                                style={{ margin: "0 5px", fontSize: "16px" }}
                              >
                                {photoDetails[post.shared_photoId]?.upvotes}
                              </span>
                              <button
                                style={{
                                  border: "none",
                                  cursor: "pointer",
                                  outline: "none",
                                  boxShadow: "none",
                                  background: "transparent",
                                }}
                                onClick={() => {
                                  handleDownvote(post.shared_photoId, "photo");
                                }}
                                disabled={
                                  photoVotingStatus[post.shared_photoId] ===
                                  "downvoted"
                                }
                              >
                                <IoArrowDownCircle
                                  style={{
                                    color:
                                      photoVotingStatus[post.shared_photoId] ===
                                      "downvoted"
                                        ? "red"
                                        : "black",
                                    fontSize: "30px",
                                  }}
                                />
                              </button>
                              <Button
                                style={{
                                  border: "none",
                                  cursor: "pointer",
                                  outline: "none",
                                  boxShadow: "none",
                                  background: "transparent",
                                  marginLeft: "auto",
                                }}
                                onClick={() => handleShowDeleteModal(post.id)}
                              >
                                <BiHide />
                              </Button>
                            </div>
                          </div>
                        </Card.Text>
                      </Card.Body>
                    ) : null}
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No shared posts available.</p>
        )}
      </ul>

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
      <ConfirmActionModal
        confirmActionFunction={() => handleDelete(deletePostId)}
        setConfirmActionFunction={setDeletePostId}
        confirmActionText="remove from your feed"
        setConfirmActionText={setShowDeleteModal}
        showConfirmActionModal={showDeleteModal}
        setShowConfirmActionModal={setShowDeleteModal}
      />
    </Container>
  );
};

export default FeedPage;

//styling for pins
{
  /* {post.shared_pinId && (
  <div style={{ marginTop: "5px" }}>
    <p style={{ margin: 0 }}>
      Shared Pin ID: {post.shared_pinId}
    </p>
    {pinDetails[post.shared_pinId] ? (
      <div>
        <p style={{ margin: 0 }}>
          Is Toilet:{" "}
          {pinDetails[post.shared_pinId].isToilet
            ? "Yes"
            : "No"}
        </p>
        <p style={{ margin: 0 }}>
          Is Food:{" "}
          {pinDetails[post.shared_pinId].isFood ? "Yes" : "No"}
        </p>
        <p style={{ margin: 0 }}>
          Is Personal:{" "}
          {pinDetails[post.shared_pinId].isPersonal
            ? "Yes"
            : "No"}
        </p>
        <p style={{ margin: 0 }}>
          Creator:{" "}
          {userNames[pinDetails[post.shared_pinId].ownerId]}
        </p>
        <p style={{ margin: 0 }}>
          Created At:{" "}
          {dayjs(post.createdAt).format("MM/D/YY, h:mm:ss A")}
        </p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              border: "none",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
              background: "transparent",
            }}
            onClick={() => {
              handleUpvote(post.shared_pinId, "pin");
            }}
            disabled={
              pinVotingStatus[post.shared_pinId] === "upvoted"
            }
          >
            <IoArrowUpCircle
              style={{
                color:
                  pinVotingStatus[post.shared_pinId] ===
                  "upvoted"
                    ? "green"
                    : "black",
                fontSize: "30px",
              }}
            />
          </button>
          <span style={{ margin: "0 5px" }}>
            {pinDetails[post.shared_pinId]?.upvotes}
          </span>
          <button
            style={{
              border: "none",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
              background: "transparent",
            }}
            onClick={() => {
              handleDownvote(post.shared_pinId, "pin");
            }}
            disabled={
              pinVotingStatus[post.shared_pinId] === "downvoted"
            }
          >
            <IoArrowDownCircle
              style={{
                color:
                  pinVotingStatus[post.shared_pinId] ===
                  "downvoted"
                    ? "red"
                    : "black",
                fontSize: "30px",
              }}
            />
          </button>
          <button
            style={{
              border: "none",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
              background: "transparent",
              marginLeft: "auto",
            }}
            onClick={() => handleDelete(post.id)}
          >
            <BsTrash
              style={{
                color: "gold",
                fontSize: "30px",
                border: "1px solid black",
                borderRadius: "50%",
                padding: "5px",
              }}
            />
          </button>
        </div>
      </div>
    ) : null}
  </div>
)} */
}
