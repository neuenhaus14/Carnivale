import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

interface SharedPost {
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
  const [senderNames, setSenderNames] = useState<{ [userId: number]: string }>(
    {}
  );
  const [commentDetails, setCommentDetails] = useState<Comment | null>(null);
  const [pinDetails, setPinDetails] = useState<Pin | null>(null);
  const [photoDetails, setPhotoDetails] = useState<Photo | null>(null);
  const [ownerNames, setOwnerNames] = useState<{ [userId: number]: string }>(
    {}
  );

  const userId = 1;
  useEffect(() => {
    axios
      .get("/api/feed/shared-posts/1")
      .then((response) => setSharedPosts(response.data))
      .catch((error) => console.error("Error fetching shared posts:", error));

    axios
      .get("/api/feed/user/1")
      .then((response) => setCurrentUser(response.data))
      .catch((error) => console.error("Error fetching current user:", error));
  }, []);

  useEffect(() => {
    sharedPosts.forEach(async (post) => {
      try {
        if (!senderNames[post.sender_userId]) {
          await fetchSenderName(post.sender_userId);
        }

        if (!ownerNames[post.recipient_userId]) {
          await fetchOwnerName(post.recipient_userId);
        }

        if (post.shared_commentId) {
          await fetchCommentDetails(post.shared_commentId);
        }

        if (post.shared_pinId) {
          await fetchPinDetails(post.shared_pinId);
        }

        if (post.shared_photoId) {
          await fetchPhotoDetails(post.shared_photoId);
        }
      } catch (error) {
        console.error("Error fetching shared post details:", error);
      }
    });
  }, [sharedPosts, senderNames, ownerNames]);

  const fetchSenderName = async (userId: number) => {
    try {
      const response = await axios.get(`/api/feed/user/${userId}`);
      const senderName = `${response.data.firstName} ${response.data.lastName}`;
      setSenderNames((prevNames) => ({ ...prevNames, [userId]: senderName }));
    } catch (error) {
      console.error(`Error fetching sender ${userId} information:`, error);
    }
  };

  const fetchOwnerName = async (userId: number) => {
    if (ownerNames[userId] !== undefined) {
      return;
    }

    try {
      const response = await axios.get(`/api/feed/user/${userId}`);
      const ownerName = `${response.data.firstName} ${response.data.lastName}`;
      setOwnerNames((prevNames) => ({ ...prevNames, [userId]: ownerName }));
    } catch (error) {
      console.error(
        `Error fetching owner information for user ${userId}:`,
        error
      );
      setOwnerNames((prevNames) => ({
        ...prevNames,
        [userId]: "Unknown User",
      }));
    }
  };

  const fetchCommentDetails = async (commentId: number) => {
    try {
      const response = await axios.get(`/api/feed/shared-comment/${commentId}`);
      const commentDetails: Comment = {
        comment: response.data.comment,
        ownerId: response.data.ownerId,
        upvotes: response.data.upvotes,
      };
      await fetchOwnerName(commentDetails.ownerId);
      setCommentDetails(commentDetails);
    } catch (error) {
      console.error("Error fetching shared comment information:", error);
    }
  };

  const fetchPinDetails = async (pinId: number) => {
    try {
      const response = await axios.get(`/api/feed/shared-pin/${pinId}`);
      const pinDetails: Pin = {
        ownerId: response.data.ownerId,
        isToilet: response.data.isToilet,
        isFood: response.data.isFood,
        isPersonal: response.data.isPersonal,
        upvotes: response.data.upvotes,
      };
      await fetchOwnerName(pinDetails.ownerId);
      setPinDetails(pinDetails);
    } catch (error) {
      console.error("Error fetching shared pin information:", error);
    }
  };

  const fetchPhotoDetails = async (photoId: number) => {
    try {
      const response = await axios.get(`/api/feed/shared-photo/${photoId}`);
      const photoDetails: Photo = {
        description: response.data.description,
        ownerId: response.data.ownerId,
        upvotes: response.data.upvotes,
        url: response.data.photoURL,
      };
      await fetchOwnerName(photoDetails.ownerId);
      setPhotoDetails(photoDetails);
    } catch (error) {
      console.error("Error fetching shared photo information:", error);
    }
  };

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
      await fetchPostDetails(postId, type);

      console.log(`Downvoted ${type} with ID ${postId}`);
    } catch (error) {
      console.log(`Already downvoted ${type} with ID ${postId}`);
    }
  };
  const fetchPostDetails = async (postId: number, type: string) => {
    try {
      if (type === "comment") {
        const response = await axios.get(`/api/feed/shared-comment/${postId}`);
        setCommentDetails({
          comment: response.data.comment,
          ownerId: response.data.ownerId,
          upvotes: response.data.upvotes,
        });
      } else if (type === "pin") {
        const response = await axios.get(`/api/feed/shared-pin/${postId}`);
        setPinDetails({
          ownerId: response.data.ownerId,
          isToilet: response.data.isToilet,
          isFood: response.data.isFood,
          isPersonal: response.data.isPersonal,
          upvotes: response.data.upvotes,
        });
      } else if (type === "photo") {
        const response = await axios.get(`/api/feed/shared-photo/${postId}`);
        setPhotoDetails({
          description: response.data.description,
          ownerId: response.data.ownerId,
          upvotes: response.data.upvotes,
          url: response.data.photoURL,
        });
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
                  Sender: {senderNames[post.sender_userId]}
                </p>
                {post.shared_commentId && (
                  <div style={{ marginTop: "5px" }}>
                    <p style={{ margin: 0 }}>
                      Shared Comment ID: {post.shared_commentId}
                    </p>
                    <p style={{ margin: 0 }}>
                      Comment: {commentDetails?.comment}
                    </p>
                    <p style={{ margin: 0 }}>
                      Creator: {ownerNames[commentDetails?.ownerId]}
                    </p>
                    <p style={{ margin: 0 }}>
                      Upvotes: {commentDetails?.upvotes}
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
                )}
                {post.shared_pinId && (
                  <div style={{ marginTop: "5px" }}>
                    <p style={{ margin: 0 }}>
                      Shared Pin ID: {post.shared_pinId}
                    </p>
                    <p style={{ margin: 0 }}>
                      Is Toilet: {pinDetails?.isToilet ? "Yes" : "No"}
                    </p>
                    <p style={{ margin: 0 }}>
                      Is Food: {pinDetails?.isFood ? "Yes" : "No"}
                    </p>
                    <p style={{ margin: 0 }}>
                      Is Personal: {pinDetails?.isPersonal ? "Yes" : "No"}
                    </p>
                    <p style={{ margin: 0 }}>
                      Creator: {ownerNames[pinDetails?.ownerId]}
                    </p>
                    <p style={{ margin: 0 }}>Upvotes: {pinDetails?.upvotes}</p>
                    <button
                      onClick={() => handleUpvote(post.shared_pinId, "pin")}
                    >
                      Upvote Pin
                    </button>
                    <button
                      onClick={() => handleDownvote(post.shared_pinId, "pin")}
                    >
                      Downvote Pin
                    </button>
                    <button onClick={() => handleDelete(post.id)}>
                      Delete Post
                    </button>
                  </div>
                )}
                {post.shared_photoId && (
                  <div style={{ marginTop: "5px" }}>
                    <p style={{ margin: 0 }}>
                      Shared Photo ID: {post.shared_photoId}
                    </p>
                    <p style={{ margin: 0 }}>
                      Description: {photoDetails?.description}
                    </p>
                    <p style={{ margin: 0 }}>
                      Creator: {ownerNames[photoDetails?.ownerId]}
                    </p>
                    <p style={{ margin: 0 }}>
                      Upvotes: {photoDetails?.upvotes}
                    </p>
                    <img
                      src={photoDetails?.url}
                      alt="Shared Photo"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginTop: "10px",
                      }}
                    />
                    <button
                      onClick={() => handleUpvote(post.shared_photoId, "photo")}
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
                )}
                <p style={{ margin: 0 }}>
                  Created At:{" "}
                  {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
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
