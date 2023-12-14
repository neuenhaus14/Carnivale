import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

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

interface Pin {
  ownerId: number;
  isToilet: boolean;
  isFood: boolean;
  isPersonal: boolean;
  upvotes: number;
}

interface Photo {
  description: string;
  ownerId: number;
  upvotes: number;
  url: string;
}

const FeedPage = () => {
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userNames, setUserNames] = useState<{ [userId: number]: string }>({});
  const [commentDetails, setCommentDetails] = useState<{
    [postId: number]: Comment;
  }>({});
  const [pinDetails, setPinDetails] = useState<{ [postId: number]: Pin }>({});
  const [photoDetails, setPhotoDetails] = useState<{
    [postId: number]: Photo;
  }>({});
  const [deletedPosts, setDeletedPosts] = useState<number[]>([]);

  const userId = 1;

  const fetchSenderName = async (userId: number) => {
    try {
      const response = await axios.get(`/api/feed/user/${userId}`);
      const senderName = `${response.data.firstName} ${response.data.lastName}`;
      setUserNames((prevNames) => ({ ...prevNames, [userId]: senderName }));
    } catch (error) {
      console.error(`Error fetching sender ${userId} information:`, error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, userResponse] = await Promise.all([
          axios.get(`/api/feed/shared-posts/${userId}`),
          axios.get(`/api/feed/user/${userId}`),
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
          } else if (type === "pin") {
            setPinDetails((prevDetails) => ({
              ...prevDetails,
              [postId]: null,
            }));
          } else if (type === "photo") {
            setPhotoDetails((prevDetails) => ({
              ...prevDetails,
              [postId]: null,
            }));
          }

          console.error(`${type} with ID ${postId} is deleted.`);
          return;
        }

        const details = {
          comment: {
            comment: response.data.comment,
            ownerId: response.data.ownerId,
            upvotes: response.data.upvotes,
          },
          pin: {
            ownerId: response.data.ownerId,
            isToilet: response.data.isToilet,
            isFood: response.data.isFood,
            isPersonal: response.data.isPersonal,
            upvotes: response.data.upvotes,
          },
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
        } else if (type === "pin") {
          setPinDetails((prevDetails) => ({
            ...prevDetails,
            [postId]: details.pin,
          }));
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

        if (post.shared_pinId) {
          fetchPromises.push(fetchDetails(post.shared_pinId, "pin"));
        }

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
    try {
      await axios.post(
        `/api/feed/${
          type === "comment"
            ? `upvote-comment/${userId}/${postId}`
            : type === "pin"
            ? `upvote-pin/${userId}/${postId}`
            : `upvote-photo/${userId}/${postId}`
        }`
      );
      await fetchPostDetails(postId, type);

      console.log(`Upvoted ${type} with ID ${postId}`);
    } catch (error) {
      console.log(`Already upvoted ${type} with ID ${postId}`);
    }
  };

  const handleDownvote = async (postId: number, type: string) => {
    try {
      await axios.post(
        `/api/feed/${
          type === "comment"
            ? `downvote-comment/${userId}/${postId}`
            : type === "pin"
            ? `downvote-pin/${userId}/${postId}`
            : `downvote-photo/${userId}/${postId}`
        }`
      );

      const updatedSharedPosts = sharedPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: post.upvotes - 1,
            }
          : post
      );

      setSharedPosts(updatedSharedPosts);

      // Check if the post has reached -5 upvotes
      if (
        updatedSharedPosts.find((post) => post.id === postId)?.upvotes === -5
      ) {
        setDeletedPosts((prevDeletedPosts) => [...prevDeletedPosts, postId]);
      }

      console.log(`Downvoted ${type} with ID ${postId}`);
    } catch (error) {
      console.log(`Already downvoted ${type} with ID ${postId}`);
    }
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
      } else if (type === "pin") {
        const response = await axios.get(`/api/feed/shared-pin/${postId}`);
        setPinDetails((prevDetails) => ({
          ...prevDetails,
          [postId]: {
            ownerId: response.data.ownerId,
            isToilet: response.data.isToilet,
            isFood: response.data.isFood,
            isPersonal: response.data.isPersonal,
            upvotes: response.data.upvotes,
          },
        }));
      } else if (type === "photo") {
        const response = await axios.get(`/api/feed/shared-photo/${postId}`);
        setPhotoDetails((prevDetails) => ({
          ...prevDetails,
          [postId]: {
            description: response.data.description,
            ownerId: response.data.ownerId,
            upvotes: response.data.upvotes,
            url: response.data.photoURL,
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
    try {
      await axios.delete(`/api/feed/shared-posts/${postId}`);

      setSharedPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    } catch (error) {
      console.error(`Error deleting post with ID ${postId}:`, error);
    }
  };

  return (
    <div>
      <h1>
        Welcome,{" "}
        {currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : "User"}
        !
      </h1>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {Array.isArray(sharedPosts) && sharedPosts.length > 0 ? (
          sharedPosts.map((post) => (
            <li key={post.id} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p style={{ margin: 0 }}>
                  Sender: {userNames[post.sender_userId]}
                </p>
                {/* Comments */}
                {post.shared_commentId && (
                  <div style={{ marginTop: "5px" }}>
                    <p style={{ margin: 0 }}>
                      Shared Comment ID: {post.shared_commentId}
                    </p>
                    {commentDetails[post.shared_commentId] ? (
                      <div>
                        <p style={{ margin: 0 }}>
                          Comment:{" "}
                          {commentDetails[post.shared_commentId].comment}
                        </p>
                        <p style={{ margin: 0 }}>
                          Creator:{" "}
                          {
                            userNames[
                              commentDetails[post.shared_commentId].ownerId
                            ]
                          }
                        </p>
                        <p style={{ margin: 0 }}>
                          Upvotes:{" "}
                          {commentDetails[post.shared_commentId].upvotes}
                        </p>
                        <button
                          onClick={() =>
                            handleUpvote(post.shared_commentId, "comment")
                          }
                        >
                          Upvote Comment
                        </button>
                        <button
                          onClick={() =>
                            handleDownvote(post.shared_commentId, "comment")
                          }
                        >
                          Downvote Comment
                        </button>
                        <button onClick={() => handleDelete(post.id)}>
                          Delete Post
                        </button>
                      </div>
                    ) : (
                      <p style={{ color: "red" }}>
                        This post has been deleted due to too many downvotes.
                      </p>
                    )}
                  </div>
                )}
                {/* Pins */}
                {post.shared_pinId && (
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
                          Upvotes: {pinDetails[post.shared_pinId].upvotes}
                        </p>
                        <button
                          onClick={() => handleUpvote(post.shared_pinId, "pin")}
                        >
                          Upvote Pin
                        </button>
                        <button
                          onClick={() =>
                            handleDownvote(post.shared_pinId, "pin")
                          }
                        >
                          Downvote Pin
                        </button>
                        <button onClick={() => handleDelete(post.id)}>
                          Delete Post
                        </button>
                      </div>
                    ) : (
                      <p style={{ color: "red" }}>
                        This post has been deleted due to too many downvotes.
                      </p>
                    )}
                  </div>
                )}
                {/* Photos */}
                {post.shared_photoId && (
                  <div style={{ marginTop: "5px" }}>
                    <p style={{ margin: 0 }}>
                      Shared Photo ID: {post.shared_photoId}
                    </p>
                    {photoDetails[post.shared_photoId] ? (
                      <div>
                        <p style={{ margin: 0 }}>
                          Description:{" "}
                          {photoDetails[post.shared_photoId].description}
                        </p>
                        <p style={{ margin: 0 }}>
                          Creator:{" "}
                          {userNames[photoDetails[post.shared_photoId].ownerId]}
                        </p>
                        <p style={{ margin: 0 }}>
                          Upvotes: {photoDetails[post.shared_photoId].upvotes}
                        </p>
                        <img
                          src={photoDetails[post.shared_photoId].url}
                          alt="Shared Photo"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            marginTop: "10px",
                          }}
                        />
                        <button
                          onClick={() =>
                            handleUpvote(post.shared_photoId, "photo")
                          }
                        >
                          Upvote Photo
                        </button>
                        <button
                          onClick={() =>
                            handleDownvote(post.shared_photoId, "photo")
                          }
                        >
                          Downvote Photo
                        </button>
                        <button onClick={() => handleDelete(post.id)}>
                          Delete Post
                        </button>
                      </div>
                    ) : (
                      <p style={{ color: "red" }}>
                        This post has been deleted due to too many downvotes.
                      </p>
                    )}
                  </div>
                )}
                <p style={{ margin: 0 }}>
                  Created At:{" "}
                  {dayjs(post.createdAt).format("MMMM D YYYY, h:mm:ss A")}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p>No shared posts available.</p>
        )}
      </ul>
    </div>
  );
};

export default FeedPage;
