import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Modal from "react-modal";

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
  // id: number;
  comment: string;
  ownerId: number;
  upvotes: number;
}

interface Pin {
  //id: number;
  isToilet: boolean;
  isFood: boolean;
  isPersonal: boolean;
  upvotes: number;
  ownerId: number;
}

interface Photo {
  // id: number;
  description: string;
  ownerId: number;
  upvotes: number;
  url: string;
}

const formatJSON = (jsonString: string): string => {
  return jsonString.replace(/"([^"]+)":/g, "$1:");
};

const FeedPage = () => {
  const [sharedPosts, setSharedPosts] = useState<SharedPost[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [senderNames, setSenderNames] = useState<{ [userId: number]: string }>(
    {}
  );
  const [modalContent, setModalContent] = useState<
    Photo | Comment | Pin | null
  >(null);
  const [ownerNames, setOwnerNames] = useState<{ [userId: number]: string }>(
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
    sharedPosts.forEach((post) => {
      if (!senderNames[post.sender_userId]) {
        fetchSenderName(post.sender_userId);
      }
      if (!ownerNames[post.recipient_userId]) {
        fetchOwnerName(post.recipient_userId);
      }
    });
  }, [sharedPosts, senderNames, ownerNames]);

  const fetchSenderName = async (userId: number) => {
    try {
      const response = await axios.get(`/api/feed/user/${userId}`);
      const senderName = `${response.data.firstName} ${response.data.lastName}`;

      setSenderNames((prevNames) => ({
        ...prevNames,
        [userId]: senderName,
      }));
    } catch (error) {
      console.error(`Error fetching sender ${userId} information:`, error);
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

      setModalContent(commentDetails);
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

      setModalContent(pinDetails);
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

      setModalContent(photoDetails);
    } catch (error) {
      console.error("Error fetching shared photo information:", error);
    }
  };

  const fetchOwnerName = async (userId: number) => {
    try {
      const response = await axios.get(`/api/feed/user/${userId}`);
      const ownerName = `${response.data.firstName} ${response.data.lastName}`;

      setOwnerNames((prevNames) => ({
        ...prevNames,
        [userId]: ownerName,
      }));
    } catch (error) {
      console.error(
        `Error fetching owner information for user ${userId}:`,
        error
      );
    }
  };

  const closeModal = () => {
    setModalContent(null);
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
      <ul>
        {Array.isArray(sharedPosts) && sharedPosts.length > 0 ? (
          sharedPosts.map((post) => (
            <li key={post.id}>
              <p>Sender: {senderNames[post.sender_userId]}</p>
              {post.shared_commentId && (
                <>
                  <p>Shared Comment ID: {post.shared_commentId}</p>
                  <button
                    onClick={() => fetchCommentDetails(post.shared_commentId!)}
                  >
                    Comment Details
                  </button>
                </>
              )}
              {post.shared_pinId && (
                <>
                  <p>Shared Pin ID: {post.shared_pinId}</p>
                  <button onClick={() => fetchPinDetails(post.shared_pinId!)}>
                    Pin Details
                  </button>
                </>
              )}
              {post.shared_photoId && (
                <>
                  <p>Shared Photo ID: {post.shared_photoId}</p>
                  <button
                    onClick={() => fetchPhotoDetails(post.shared_photoId!)}
                  >
                    Photo Details
                  </button>
                </>
              )}

              {post.shared_commentId ||
              post.shared_pinId ||
              post.shared_photoId ? (
                <p>Owner: {ownerNames[post.recipient_userId]}</p>
              ) : null}

              <p>
                Created At:{" "}
                {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
            </li>
          ))
        ) : (
          <p>No shared posts available.</p>
        )}
      </ul>

      <Modal
        isOpen={!!modalContent}
        onRequestClose={closeModal}
        contentLabel="Details Modal"
        ariaHideApp={false}
      >
        <div>
          {modalContent && typeof modalContent === "object" && (
            <>
              {"url" in modalContent && (
                <img src={(modalContent as Photo).url} alt="Shared Photo" />
              )}
              {"ownerId" in modalContent && (
                <>
                  <p style={{ marginBottom: 0 }}>
                    Owner:
                    {
                      ownerNames[
                        (modalContent as Comment | Pin | Photo).ownerId
                      ]
                    }
                  </p>
                  <pre>
                    {formatJSON(
                      JSON.stringify(
                        { ...modalContent, ownerId: undefined },
                        null,
                        2
                      ).slice(1, -1)
                    )}
                  </pre>
                </>
              )}
            </>
          )}
          <button onClick={closeModal}>Close Modal</button>
        </div>
      </Modal>
    </div>
  );
};

export default FeedPage;
