import React from "react";
import { useLocation, useParams } from "react-router-dom";
import trainsData from "../merged_trains_complete.json";
import "./TrainDetails.css";

const TrainDetails = () => {
  const location = useLocation();
  const { trainNumber } = useParams();

  let { train } = location.state || {};
  if (!train) {
    train =
      trainsData.trains?.find((t) => t.trainNumber === trainNumber) || null;
  }

  if (!train) {
    return (
      <p className="text-center text-danger mt-4">
        No details found for train {trainNumber}.
      </p>
    );
  }

  return (
    <div className="train-details-container">
      {/* Header */}
      <h5 className="train-title">
        {train.trainNumber} | {train.trainName}
      </h5>
      <p className="train-subtitle">
        {train.from} → {train.to}
      </p>
      <p className="train-date">Runs: {train.days.join(", ")}</p>

      {/* Timeline */}
      <div className="timeline-container">
        {/* Source */}
        <div className="timeline-item">
          <div className="timeline-marker start"></div>
          <div className="station-card">
            <h6>
              {train.from} ({train.sourceCode})
            </h6>
            <p>
              <strong>Departure:</strong> {train.departureTime}
            </p>
          </div>
        </div>

        {/* Duration in middle */}
        <div className="timeline-duration">
          ⏱ Duration: {train.duration.split(":")[0]}h{" "}
          {train.duration.split(":")[1]}m
        </div>

        {/* Destination */}
        <div className="timeline-item">
          <div className="timeline-marker end"></div>
          <div className="station-card">
            <h6>
              {train.to} ({train.destinationCode})
            </h6>
            <p>
              <strong>Arrival:</strong> {train.arrivalTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainDetails;
