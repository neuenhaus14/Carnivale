import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

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

const Parade = () => {
  const [paradeInfo, setParadeInfo] = useState<ParadeInfo | null>(null);
  const [selectedParade, setSelectedParade] = useState<string | null>(null);
  const [paradeList, setParadeList] = useState<string[]>([]);

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
    const formattedParadeName = selectedParadeName
      .replace(/\s+/g, "-")
      .toLowerCase();

    try {
      const response = await axios.get<ParadeInfo>(
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
    </div>
  );
};

export default Parade;
