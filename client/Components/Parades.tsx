import React, { useEffect, useState } from "react";
import axios from "axios";

const Parade = () => {
  const [paradeInfo, setParadeInfo] = useState<any>(null);

  const fetchParadeInfo = async (paradeName: string) => {
    try {
      const response = await axios.get(
        `/api/parades/parade-info/${paradeName}`
      );
      console.log("parade response", response.data);
      setParadeInfo(response.data);
    } catch (error) {
      console.error("Error fetching parade information:", error.message);
    }
  };

  useEffect(() => {
    const exampleParadeName = "krewe-of-endymion";
    fetchParadeInfo(exampleParadeName);
  }, []);

  return (
    <div>
      {paradeInfo && (
        <div>
          <h2>{paradeInfo.title}</h2>
          <p>{paradeInfo.startDate}</p>
          <img
            src={`https://www.mardigrasneworleans.com${paradeInfo.imageSrc}`}
            alt="Parade Map"
          />
          <img
            src={`https://www.mardigrasneworleans.com${paradeInfo.imageParade}`}
            alt="Parade Logo"
          />

          <p>{paradeInfo.description}</p>
          <p>{paradeInfo.directionsText}</p>
          <p>{paradeInfo.otherParades}</p>
        </div>
      )}
    </div>
  );
};

export default Parade;
