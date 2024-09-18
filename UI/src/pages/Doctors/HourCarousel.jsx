import React, { useState, useEffect } from "react";
import "../../styles/HourCarousel.css";

const HourCarousel = ({
  startHour,
  endHour,
  unavailableHours,
  onSelectHour,
  selectedHour,
  isDateValid,
}) => {
  const [visibleHours, setVisibleHours] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const hours = [];
    for (let i = startHour; i <= endHour; i++) {
      hours.push(i);
    }
    setVisibleHours(hours);
  }, [startHour, endHour]);

  const moveLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const moveRight = () => {
    if (startIndex < visibleHours.length - 5) {
      setStartIndex(startIndex + 1);
    }
  };

  return (
    <div className="hour-carousel">
      <button onClick={moveLeft} className="nav-button left">
        &lt;
      </button>
      <div className="hour-list">
        {visibleHours.slice(startIndex, startIndex + 5).map((hour) => (
          <div
            key={hour}
            className={`hour-item ${
              unavailableHours.includes(hour) ? "unavailable" : ""
            } ${hour === selectedHour ? "selected" : ""} ${
              !isDateValid ? "disabled" : ""
            }`}
            onClick={() => {
              if (isDateValid && !unavailableHours.includes(hour)) {
                onSelectHour(hour);
              }
            }}
          >
            {hour}:00
          </div>
        ))}
      </div>
      <button onClick={moveRight} className="nav-button right">
        &gt;
      </button>
    </div>
  );
};

export default HourCarousel;
