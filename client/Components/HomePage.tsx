import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Tab,
  Tabs,
  Modal,
} from "react-bootstrap";
import { FaCommentDots } from "@react-icons/all-files/fa/FaCommentDots";

import { FaCamera } from "@react-icons/all-files/fa/FaCamera";

import axios from "axios";
import HomeModal from "./HomeModal";
import PostCard from "./PostCard";
import { ThemeContext } from "./Context";

//PARENT OF HOMEMODAL

interface HomePageProps {
  lat: number;
  lng: number;
  userId: number;
}

const HomePage: React.FC<HomePageProps> = ({ lat, lng, userId }) => {
  const [comment, setComment] = useState("");
  const [posts, setPosts] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState("posts");
  const [order, setOrder] = useState("upvotes");
  const theme = useContext(ThemeContext);

  const [showAboutModal, setShowAboutModal] = useState(true);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  const modalTrigger = () => {
    setShowModal(true);
  };

  function handleInput(e: any) {
    setComment(e.target.value);
  }

  function handleKeyDown(e: any) {
    //if key is enter, prevent default
    // if (e.key === "Enter" && comment.length > 0) {
    //   //if comment is valid, submit comment
    //   e.preventDefault();
    //   handleSubmit();
    // } else if (e.key === "Enter") {
    //   e.preventDefault();
    // }
  }

  //when tab is changed, set tab key and getPost for that tab
  function handleSelect(k: string) {
    setKey(k);
    getPosts(k);
  }

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/home/${userId}`, { comment });
      setComment("");
    } catch (err) {
      console.error(err);
    } finally {
      getPosts(key);
    }
  };

  const getPosts = async (e: string) => {
    try {
      const { data } = await axios.get(`/api/home/${e}`);
      if (order === "upvotes") {
        setPosts(
          data.sort(
            (a: any, b: any) =>
              (b[order as string] as number) - (a[order as string] as number)
          )
        );
      } else {
        setPosts(
          data.sort(
            (a: any, b: any) =>
              (new Date(b[order as any]) as any) -
              (new Date(a[order as any]) as any)
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    //on initial render, or tab click
    //getPosts and setInterval for 5 sec
    getPosts(key);
    const interval = setTimeout(() => {
      getPosts(key);
    }, 15000);
    return () => clearTimeout(interval);
  }, [key, order]);

  return (
    <Container className={`body-home ${theme}`}>
      <Modal show={showAboutModal} onHide={toggleAboutModal}>
        <Modal.Header closeButton>
          <Modal.Title>About the Home Page</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Home to gossip to share parade hold ups, fun sightings, or interesting images! Take a picture, filter results, and send a comment.</p>
          <p>Take the <a href="https://docs.google.com/forms/d/e/1FAIpQLSfSGLNva3elpadLqpXw1WuD9b4H39lBuX6YMiKT5_o2DNQ7Gg/viewform">Survey</a> and let us know what you think!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleAboutModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <div
          key={"inline-radio"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "5px",
          }}
        >
          Sort by:
          <Form.Check
            style={{ marginLeft: "20px" }}
            type="radio"
            name="Sort"
            label="Newest"
            inline
            onClick={() => setOrder("createdAt")}
          />
          <Form.Check
            type="radio"
            name="Sort"
            label="Upvotes"
            inline
            onClick={() => setOrder("upvotes")}
          />
        </div>
      </Row>

      <Row>
        <Tabs activeKey={key} onSelect={handleSelect}>
          <Tab eventKey="posts" title="Gossip">
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                    getPosts={getPosts}
                    order={order}
                    eventKey={"posts"}
                  />
                ))
              : ""}
          </Tab>
          <Tab eventKey="costumes" title="Costumes">
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                    getPosts={getPosts}
                    order={order}
                    eventKey={"costumes"}
                  />
                ))
              : ""}
          </Tab>
          <Tab eventKey="throws" title="Throws">
            {posts
              ? posts.map((item: any, index: number) => (
                  <PostCard
                    key={`${item.id} + ${index}`}
                    post={item}
                    userId={userId}
                    getPosts={getPosts}
                    order={order}
                    eventKey={"throws"}
                  />
                ))
              : ""}
          </Tab>
        </Tabs>
      </Row>
      {key === "posts" ? (
        <Row>
          <Card
            className="comment-form"
            style={{ position: "fixed", bottom: "11.4vh" }}
          >
            <Form style={{ width: "100%" }}>
              <Form.Group>
                <Form.Control
                  placeholder="leave a comment..."
                  onChange={handleInput}
                  value={comment}
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                  }}
                />
                <Button onClick={modalTrigger} className="photo-btn">
                  <FaCamera />
                </Button>
                {showModal ? (
                  <HomeModal
                    setShowModal={setShowModal}
                    lat={lat}
                    lng={lng}
                    userId={userId}
                  />
                ) : null}
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  //disabled={comment.length <= 0}
                  disabled={true}
                  className="comment-btn"
                >
                  <FaCommentDots />
                </Button>
              </Form.Group>
            </Form>
          </Card>
        </Row>
      ) : (
        ""
      )}
    </Container>
  );
};

export default HomePage;
