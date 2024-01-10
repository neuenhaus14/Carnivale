import React, { ReactPropTypes, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import EventBasicModal from './EventBasicModal';
import EventCreateModal from './EventCreateModal';
import ConfirmActionModal from './ConfirmActionModal';
import {
  Button,
  Container,
  Accordion,
  Row,
  Col,
  Tab,
  Tabs,
} from 'react-bootstrap';
import { LuThumbsUp, LuThumbsDown } from 'react-icons/lu';
import { MdCancel, MdOutlineRemoveCircle } from 'react-icons/md';
import { IoPersonRemoveSharp } from 'react-icons/io5';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { useAuth0 } from '@auth0/auth0-react';

//                              add userId as prop to get it from App
const UserPage: React.FC<UserPageProps> = ({
  getLocation,
  //userId,
  lng,
  lat,
}) => {
  const [searchParams] = useSearchParams();
  const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [friends, setFriends] = useState([]); // array of user id's
  const [friendRequestsMade, setFriendRequestsMade] = useState([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
  const [eventsParticipating, setEventsParticipating] = useState([
    { name: 'event1' },
  ]);
  const [eventsInvited, setEventsInvited] = useState([{ name: 'event2' }]);
  const [eventsOwned, setEventsOwned] = useState([{ name: 'event3' }]);

  // const [phoneForFriendRequest, setPhoneForFriendRequest] = useState('');
  // const [nameForFriendRequest, setNameForFriendRequest] = useState('');
  const [nameOrPhoneForFriendRequest, setNameOrPhoneForFriendRequest] =
    useState('');

  const [selectedEvent, setSelectedEvent] = useState({
    latitude: 0,
    longitude: 0,
    startTime: null,
    endTime: null,
  }); // default to make modals happy
  const [isUserAttending, setIsUserAttending] = useState(false); // this gets passed to basic modal to expose invite functionality
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showConfirmActionModal, setShowConfirmActionModal] = useState(false);
  const [confirmActionFunction, setConfirmActionFunction] = useState(null);
  const [confirmActionText, setConfirmActionText] = useState('');

  const [isNewEvent, setIsNewEvent] = useState(false);

  // logout functionality via auth0
  const { logout } = useAuth0();

  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`);
      // console.log('here', friends.data);
      setFriends(friends.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user friends', err);
    }
  };

  const getEventsOwned = async () => {
    try {
      const eventsOwned = await axios.get(
        `api/events/getEventsOwned/${userId}`
      );
      // console.log('eventsOwned', eventsOwned.data);
      setEventsOwned(eventsOwned.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to get events owned', err);
    }
  };

  const getEventsParticipating = async () => {
    try {
      const eventsParticipating = await axios.get(
        `api/events/getEventsParticipating/${userId}`
      );
      setEventsParticipating(eventsParticipating.data);
    } catch (err) {
      console.error(
        "CLIENT ERROR: failed to GET user's participating events",
        err
      );
    }
  };

  const getEventsInvited = async () => {
    try {
      const eventsInvited = await axios.get(
        `api/events/getEventsInvited/${userId}`
      );
      setEventsInvited(eventsInvited.data);
    } catch (err) {
      console.error(
        "CLIENT ERROR: failed to GET user's event invitations",
        err
      );
    }
  };

  const getFriendRequests = async () => {
    try {
      const friendRequestsData = await axios.get(
        `api/friends/getFriendRequests/${userId}`
      );
      const { requestsMadeUsers, requestsReceivedUsers } =
        friendRequestsData.data;
      // console.log(requestsMadeUsers, requestsReceivedUsers)
      setFriendRequestsReceived(requestsReceivedUsers);
      setFriendRequestsMade(requestsMadeUsers);
    } catch (err) {
      console.error('CLIENT ERROR: could not GET friend requests ', err);
    }
  };

  // POPULATES USERPAGE WITH CORRECT PEOPLE, EVENTS
  // isNewEvent is switched to false
  // whenever modal closes, so this
  // uE runs whenever a modal closes,
  // to refresh info
  useEffect(() => {
    if (isNewEvent === false) {
      getFriends();
      getEventsOwned();
      getEventsParticipating();
      getEventsInvited();
      getFriendRequests();
    }
  }, [userId, isNewEvent]);

  // ALL RENDERED DATA ARE IN LIST ITEMS
  let userFriendsItems = null;
  if (friends.length > 0) {
    userFriendsItems = friends.map((friend: any, index: number) => {
      return (
        <div className='d-flex' key={index}>
          <div className='flex-grow-1  mx-5'>
            {friend.firstName} {`${friend.lastName.slice(0, 1)}.`}
          </div>
          <div className='mx-5'>
            <Button
              size='sm'
              variant='danger'
              onClick={async () => {
                await setConfirmActionFunction(() => () => unfriend(friend.id));
                await setConfirmActionText(
                  `remove ${friend.firstName} from your krewe.`
                );
                await setShowConfirmActionModal(true);
              }}
            >
              {/*'REMOVE '*/}{' '}
              <IoPersonRemoveSharp style={{ verticalAlign: '-2px' }} />
            </Button>
          </div>
        </div>
      );
    });
  }

  let requestsMadeItems = null;
  if (friendRequestsMade.length > 0) {
    requestsMadeItems = friendRequestsMade.map((requestee, index: number) => {
      return (
        <div className='d-flex' key={index}>
          <div className='flex-grow-1  mx-5'>
            {requestee.firstName} {`${requestee.lastName.slice(0, 1)}.`}
          </div>
          <div className='mx-5'>
            <Button
              variant='danger'
              size='sm'
              // onClick={() => cancelFriendRequest(requestee.id)}
              onClick={async () => {
                await setConfirmActionFunction(
                  () => () => cancelFriendRequest(requestee.id)
                );
                await setConfirmActionText(
                  `revoke your krewe invitation from ${requestee.firstName}.`
                );
                await setShowConfirmActionModal(true);
              }}
            >
              <MdCancel style={{ verticalAlign: '-2px' }} />
            </Button>
          </div>
        </div>
      );
    });
  }

  let requestsReceivedItems = null;
  if (friendRequestsReceived.length > 0) {
    requestsReceivedItems = friendRequestsReceived.map((requester, index) => {
      return (
        <div className='d-flex' key={index}>
          <div className='flex-grow-1  mx-5'>
            {requester.firstName} {`${requester.lastName.slice(0, 1)}.`}
          </div>
          <div className='mx-5'>
            <Button
              className='mx-1'
              size='sm'
              variant='success'
              onClick={() => answerFriendRequest(requester.id, true)}
            >
              <FaThumbsUp style={{ verticalAlign: '-2px' }} />
            </Button>
            <Button
              className='mx-1'
              size='sm'
              variant='danger'
              // onClick={() => answerFriendRequest(requester.id, false)}
              onClick={async () => {
                await setConfirmActionFunction(
                  () => () => answerFriendRequest(requester.id, false)
                );
                await setConfirmActionText(
                  `reject ${requester.firstName}'s krewe invitation.`
                );
                await setShowConfirmActionModal(true);
              }}
            >
              <FaThumbsDown style={{ verticalAlign: '-2px' }} />
            </Button>
          </div>
        </div>
      );
    });
  }

  let eventsOwnedItems = null;
  if (eventsOwned.length > 0) {
    eventsOwnedItems = eventsOwned.map((event: any, index: number) => {
      return (
        <div
          key={index}
          onClick={() => {
            setIsNewEvent(false);
            setIsUserAttending(true);
            setShowCreateModal(true);
            setSelectedEvent(event);
          }}
        >
          {event.name} <em>{dayjs().to(dayjs(event.startTime))}</em>
        </div>
      );
    });
  }

  let eventsParticipatingItems = null;
  if (eventsParticipating.length > 0) {
    eventsParticipatingItems = eventsParticipating.map(
      (event: any, index: number) => {
        return (
          <div
            key={index}
            onClick={() => {
              setIsNewEvent(false);
              setIsUserAttending(true);
              setShowBasicModal(true);
              setSelectedEvent(event);
            }}
          >
            {event.name} <em>{dayjs().to(dayjs(event.startTime))}</em>
          </div>
        );
      }
    );
  }

  let eventsInvitedItems = null;
  if (eventsInvited.length > 0) {
    eventsInvitedItems = eventsInvited.map((event: any, index: number) => {
      return (
        <div
          key={index}
          onClick={() => {
            setIsNewEvent(false);
            setIsUserAttending(false);
            setShowBasicModal(true);
            setSelectedEvent(event);
          }}
        >
          {event.name} <em>{dayjs().to(dayjs(event.startTime))}</em>
        </div>
      );
    });
  }

  // FUNCTIONS FOR DATA ITEMS
  // FRIENDS
  async function requestFriend() {
    try {
      // checking for phoneNumber
      let phoneForFriendRequest = '';
      let nameForFriendRequest = '';

      if (nameOrPhoneForFriendRequest.indexOf('-') !== -1) {
        phoneForFriendRequest = nameOrPhoneForFriendRequest;
      } else if (nameOrPhoneForFriendRequest.indexOf(' ') !== -1) {
        nameForFriendRequest = nameOrPhoneForFriendRequest;
      }

      const friendRequestResponse = await axios.post(
        '/api/friends/requestFriend',
        {
          friendRequest: {
            requester_userId: userId,
            recipient_phoneNumber: phoneForFriendRequest,
            recipient_name: nameForFriendRequest,
          },
        }
      );

      setNameOrPhoneForFriendRequest('');
      getFriendRequests();
    } catch (err) {
      console.error('CLIENT ERROR: failed to POST friend request', err);
    }
  }

  async function cancelFriendRequest(recipient_userId: number) {
    const deleteResponse = await axios.delete(
      `/api/friends/cancelFriendRequest/${userId}-${recipient_userId}`
    );
    //console.log(deleteResponse);
    getFriendRequests();
  }

  async function answerFriendRequest(
    requester_userId: number,
    isConfirmed: boolean
  ) {
    const updatedRelationship = await axios.patch(
      '/api/friends/answerFriendRequest',
      {
        answer: {
          requester_userId,
          recipient_userId: userId,
          isConfirmed,
        },
      }
    );
    //console.log('updated Relationship', updatedRelationship);
    getFriends();
    getFriendRequests();
  }

  async function unfriend(friendId: number) {
    //console.log('inside unfriend', friendId);
    const deleteResponse = await axios.delete(
      `/api/friends/unfriend/${userId}-${friendId}`
    );
    //console.log(deleteResponse)
    getFriends();
  }

  function handleNameOrPhoneInput(e: any) {
    setNameOrPhoneForFriendRequest(e.target.value);
  }

  console.log('inside userpage. confirmActionFunction', confirmActionFunction);
  return (
    <Container className='body' style={{ justifyContent: 'space-between' }}>
      <ConfirmActionModal
        confirmActionFunction={confirmActionFunction}
        setConfirmActionFunction={setConfirmActionFunction}
        confirmActionText={confirmActionText}
        setConfirmActionText={setConfirmActionText}
        showConfirmActionModal={showConfirmActionModal}
        setShowConfirmActionModal={setShowConfirmActionModal}
      />

      <EventBasicModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setShowBasicModal={setShowBasicModal}
        showBasicModal={showBasicModal}
        friends={friends}
        userId={userId}
        isUserAttending={isUserAttending}
        setIsUserAttending={setIsUserAttending}
        getEventsInvited={getEventsInvited}
        getEventsParticipating={getEventsParticipating}
      />

      <EventCreateModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setShowCreateModal={setShowCreateModal}
        showCreateModal={showCreateModal}
        friends={friends}
        userId={userId}
        // isUserAttending={isUserAttending}
        // setIsUserAttending={setIsUserAttending}
        // getEventsInvited={getEventsInvited}
        // getEventsParticipating={getEventsParticipating}
        isNewEvent={isNewEvent}
        setIsNewEvent={setIsNewEvent}
        lat={lat}
        lng={lng}
        //getLocation={getLocation}
        eventType={'user'}
        getEventsOwned={getEventsOwned}
      />

      <Row className="userPage-tabs">
        <Tabs className='mt-3' defaultActiveKey='krewe'>
          <Tab eventKey='krewe' title='Krewe'>
            <h5> Krewe </h5>
            {friends.length > 0 ? (
              <div className='m-2'>{userFriendsItems}</div>
            ) : (
              <>
                <div className='card-content text-center'>
                  You're flying solo!
                </div>
                <div className='card-detail text-center'>
                  Assemble your krewe by searching for friends below
                </div>
              </>
            )}

            <div className='d-flex flex-column align-items-center p-2'>
              <input
                style={{ width: '75vw' }}
                placeholder='###-###-#### || First Last'
                value={nameOrPhoneForFriendRequest}
                onChange={handleNameOrPhoneInput}
              ></input>
              <div className='d-flex flew-row m-2'>
                <small className='mx-1'>Invite to Krewe</small>
                <Button
                  className='mx-1'
                  style={{ width: '23px' }}
                  size='sm'
                  variant='success'
                  onClick={requestFriend}
                >
                  <FaEnvelope style={{ verticalAlign: '-2px' }} />
                </Button>
              </div>
            </div>

            {
              // conditional checks for outgoing requests
              friendRequestsMade.length > 0 && (
                <>
                  <h5> Waiting on... </h5>
                  <div>{requestsMadeItems}</div>
                </>
              )
            }

            {
              // conditional checks for incoming requests
              friendRequestsReceived.length > 0 && (
                <>
                  <h5> Respond to... </h5>
                  <div>{requestsReceivedItems}</div>
                </>
              )
            }
          </Tab>

          <Tab eventKey='calendar' title='Calendar'>
            {
              // conditional check: if no events owned or invited or attending, show default message
              eventsOwned.length === 0 &&
                eventsInvited.length === 0 &&
                eventsParticipating.length === 0 && (
                  <>
                    <div className='card-content text-center mt-3'>
                      Nothing going on in here!
                    </div>
                    <div className='card-detail text-center'>
                      Make plans or connect with your Krewe to beef up your
                      calendar.
                    </div>
                  </>
                )
            }

            {
              // conditional check for events you own
              eventsOwned.length > 0 && (
                <>
                  <div className='d-flex flex-dir-row align-items-baseline'>
                    <h5>Your Plans</h5>
                  </div>
                  <div>{eventsOwnedItems}</div>
                </>
              )
            }

            {
              // conditional checks for events you've attending
              eventsParticipating.length > 0 && (
                <>
                  <div className='d-flex flex-dir-row align-items-baseline'>
                    <h5>Schedule</h5>
                  </div>
                  <div>{eventsParticipatingItems}</div>
                </>
              )
            }

            {
              // conditional checks for events you've invited to
              eventsInvited.length > 0 && (
                <>
                  <div className='d-flex flex-dir-row align-items-baseline'>
                    <h5>Archived & Invited</h5>
                  </div>
                  <div>{eventsInvitedItems}</div>
                </>
              )
            }
          </Tab>
        </Tabs>
      </Row>

      {/* Buttons for logout, other events */}

      <Row>
        <div
          className='mb-3'
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          <Button
            variant='danger'
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </Button>

          <Button
            variant='primary'
            onClick={async () => {
              await setIsNewEvent(true);
              await setIsUserAttending(true);
              setTimeout(() => setShowCreateModal(true), 200);
            }}
          >
            Make Plans
          </Button>

          {/* Link below is styled like a bootstrap button */}
          <Link className='btn btn-primary' role='button' to='/eventpage'>
            Gigs
          </Link>
          <Link className='btn btn-primary' role='button' to='/parades'>
            Parades
          </Link>
        </div>
      </Row>
    </Container>
  );
};

interface UserPageProps {
  getLocation: any;
  lng: number;
  lat: number;
  userId: number;
}

export default UserPage;
