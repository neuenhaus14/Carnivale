import React, { useState, useEffect } from "react";
import axios from "axios";

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

const FeedPage = () => {
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [senderNames, setSenderNames] = useState<{ [userId: number]: string }>(
    {}
  );

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
    const fetchSenderName = async (userId: number) => {
      try {
        const response = await axios.get(`/api/feed/user/${userId}`);
        const senderName = `${response.data.firstName} ${response.data.lastName}`;
        setSenderNames((prevNames) => ({
          ...prevNames,
          [userId]: senderName,
        }));
      } catch (error) {
        console.error(`Error fetching user ${userId} information:`, error);
      }
    };

    sharedPosts.forEach((post) => {
      if (!senderNames[post.sender_userId]) {
        fetchSenderName(post.sender_userId);
      }
    });
  }, [sharedPosts, senderNames]);

  return (
    <div>
      <h1>
        Welcome,{" "}
        {currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : "User"}
        !
      </h1>
      <ul>
        {Array.isArray(sharedPosts) && sharedPosts.length > 0 ? (
          sharedPosts.map((post) => (
            <li key={post.id}>
              <p>Sender: {senderNames[post.sender_userId]}</p>
              {post.shared_commentId && (
                <p>Shared Comment ID: {post.shared_commentId}</p>
              )}
              {post.shared_pinId && <p>Shared Pin ID: {post.shared_pinId}</p>}
              {post.shared_photoId && (
                <p>Shared Photo ID: {post.shared_photoId}</p>
              )}
              <p>Created At: {post.createdAt}</p>
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
