import React from "react";
import "../Styles/Crane.css";

function Crane({ location }) {
  return (
    <div className="crane-location">
      <h4>Tracking Location:</h4>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
    </div>
  );
}

export default Crane;
