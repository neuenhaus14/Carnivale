import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import EventCreateModal from "./EventCreateModal";
import { Button } from "react-bootstrap";

interface ParadeInfo {
  title: string;
  startDate: string;
  location: string;
  imageSrc: string;
  imageParade: string;
  paradeInfo: string;
  directionsText: string;
  otherParades: string;
  mapLink: string;
}

interface ParadeProps {
  lng: number;
  lat: number;
  userId: number;
}

const Parade: React.FC<ParadeProps> = ({ userId, lng, lat }) => {
  const [paradeInfo, setParadeInfo] = useState<ParadeInfo | null>(null);
  const [selectedParade, setSelectedParade] = useState<string | null>(null);
  const [paradeList, setParadeList] = useState<string[]>([]);

  // state needed for create event modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  // determines whether creating or updating
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({
    latitude: 0,
    longitude: 0,
    startTime: null,
    endTime: null,
  });

  // need to get friends in order to know
  // who we can invite to the event being created
  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`);
      // console.log('here', friends.data);
      setFriends(friends.data);
    } catch (err) {
      console.error("CLIENT ERROR: failed to GET user friends", err);
    }
  };

  const fetchParadeInfo = async (paradeName: string) => {
    try {
      const response = await axios.get<ParadeInfo>(
        `/api/parades/parade-info/${paradeName}`
      );
      console.log("parade response", response.data);
      setParadeInfo(response.data);
    } catch (error) {
      console.error("Error fetching parade information:", error.message);
    }
  };

  const fetchParadeList = async () => {
    try {
      const response = await axios.get<{ parades: string[] }>(
        "/api/parades/parade-list"
      );
      setParadeList(response.data.parades);
    } catch (error) {
      console.error("Error fetching parade list:", error.message);
    }
  };

  const handleParadeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedParadeName = event.target.value;
    const formattedParadeName = encodeURIComponent(
      selectedParadeName.replace(/\s+/g, "-").toLowerCase()
    );

    try {
      const response: any = await axios.get<ParadeInfo>(
        `/api/parades/parade-info/${formattedParadeName}`
      );
      console.log("parade response", response.data);
      setParadeInfo(response.data);
    } catch (error) {
      console.error("Error fetching parade information:", error.message);
    }
  };

  useEffect(() => {
    fetchParadeList();
    getFriends();
  }, []);

  return (
    <div>
      <div>
        <label htmlFor="paradeSelect">Select a Parade: </label>
        <select
          id="paradeSelect"
          onChange={handleParadeChange}
          value={selectedParade || ""}
        >
          <option value="" disabled>
            Select a parade
          </option>
          {paradeList.map((paradeName) => (
            <option key={paradeName} value={paradeName}>
              {paradeName}
            </option>
          ))}
        </select>
      </div>

      {paradeInfo && (
        <div>
          <Button
            onClick={async () => {
              await setIsNewEvent(true);
              await setShowCreateModal(true);
              await setSelectedEvent({
                ...paradeInfo,
                latitude: 0,
                longitude: 0,
                endTime: null,
                startTime: null,
              });
            }}
          >
            Create Event
          </Button>
          <h2>{paradeInfo.title}</h2>
          <p>
            Start Time: {""}
            {dayjs(paradeInfo.startDate).format("MMMM D YYYY, h:mm:ss A")}
          </p>
          <p>
            Parade Location: {""}
            {paradeInfo.location}
          </p>
          <img
            src={`https://www.mardigrasneworleans.com${paradeInfo.imageSrc}`}
            alt="Parade Map"
            style={{
              maxWidth: "100%",
              height: "auto",
              marginTop: "10px",
            }}
          />
          <img
            src={`https://www.mardigrasneworleans.com${paradeInfo.imageParade}`}
            alt="Parade Logo"
          />

          <p>
            Parade History: <br />
            {paradeInfo.paradeInfo
              .replace(/(Year founded:)/g, ", $1")
              .replace(/(Membership:)/g, ", $1")
              .replace(/(Number of floats:)/g, ", $1")
              .replace(/(Floats by Kern Studios »)/g, ", $1")}
          </p>
          <p>
            Parade Directions: {""}
            {paradeInfo.directionsText}
          </p>
          <p>
            Other Parades on {dayjs(paradeInfo.startDate).format("MMMM D YYYY")}
            : <br />
            {paradeInfo.otherParades
              .split("\n")
              .filter(
                (parade) =>
                  !parade.includes(
                    `Parades On ${dayjs(paradeInfo.startDate).format("MMM D")}`
                  )
              )
              .map((parade) => (
                <button
                  key={parade}
                  onClick={() =>
                    fetchParadeInfo(parade.replace(/\s+/g, "-").toLowerCase())
                  }
                >
                  {parade}
                </button>
              ))}
          </p>
          <p>
            <a
              href={paradeInfo.mapLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Parade Route on Google Maps
            </a>
          </p>
        </div>
      )}

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
        eventType={"parade"}
      />
    </div>
  );
};

export default Parade;
