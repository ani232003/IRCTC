import React, { useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./filter.css";

const FilterSidebar = ({
  allTrains = [],
  selectedClasses, setSelectedClasses,
  selectedTrainTypes, setSelectedTrainTypes,
  selectedDepartureTimes, setSelectedDepartureTimes,
  selectedArrivalTimes, setSelectedArrivalTimes,
  selectedDays, setSelectedDays,
  fareRange, setFareRange,
 setOnlyAvailable
}) => {

  // Map class codes -> readable labels
  const classLabels = {
    "1A": "AC First Class (1A)",
    "2A": "AC 2 Tier (2A)",
    "3A": "AC 3 Tier (3A)",
    "CC": "AC Chair Car (CC)",
    "EC": "Executive Chair Car (EC)",
    "SL": "Sleeper (SL)"
  };

  // Unique class codes from trains (keep codes in state, show labels in UI)
  const journeyClasses = useMemo(() => {
    const codes = Array.from(new Set(allTrains.flatMap(t => t.classes || [])));
    return codes.map(code => ({ code, label: classLabels[code] || code }));
  }, [allTrains]);

  // Unique train types from trainName (uppercased)
  const trainTypes = useMemo(() => {
    return Array.from(new Set(allTrains.map(t => {
      const n = (t.trainName || "").toUpperCase();
      if (n.includes("SHATABDI")) return "SHATABDI";
      if (n.includes("TEJAS")) return "TEJAS";
      if (n.includes("VANDE BHARAT") || n.includes("VANDE")) return "VANDE BHARAT";
      if (n.includes("RAJDHANI")) return "RAJDHANI";
      if (n.includes("MAIL")) return "MAIL";
      if (n.includes("EXPRESS")) return "EXPRESS";
      return "OTHER";
    })));
  }, [allTrains]);

  // Time slots - use compact values (value used in state), label for display
  const timeSlots = [
    { value: "00:00-06:00", label: "00:00 - 06:00 Early Morning" },
    { value: "06:00-12:00", label: "06:00 - 12:00 Morning" },
    { value: "12:00-18:00", label: "12:00 - 18:00 Mid Day" },
    { value: "18:00-24:00", label: "18:00 - 24:00 Night" }
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Fare min/max (fallbacks if no trains)
  const { minFare, maxFare } = useMemo(() => {
    const fares = allTrains.flatMap(t =>
      Object.values(t.classesFare || {}).map(f => f.price || f.base_fare || 0)
    );
    if (fares.length === 0) return { minFare: 0, maxFare: 1000 };
    return { minFare: Math.min(...fares), maxFare: Math.max(...fares) };
  }, [allTrains]);

  const toggleItem = (item, array, setArray) => {
    setArray(array.includes(item) ? array.filter(i => i !== item) : [...array, item]);
  };

  const resetFilters = () => {
    setSelectedClasses([]);
    setSelectedTrainTypes([]);
    setSelectedDepartureTimes([]);
    setSelectedArrivalTimes([]);
    setSelectedDays([]);
    setFareRange([minFare, maxFare]);
    setOnlyAvailable(false);
  };

  return (
    <Container className="fs-container">
      <Row className="fs-header-row">
        <Col className="fs-header-col">
          <h6 className="fs-header-title">Refine Results</h6>
          <Button variant="link" className="fs-reset-btn" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Col>
      </Row>
      <hr />

      {/* Journey Class (store codes in state, show labels) */}
      <Row>
        <Col xs={12}><h6>JOURNEY CLASS</h6></Col>
        <Col xs={12}>
          <div className="d-flex flex-column">
            <div className="mb-1">
              <Button size="sm" variant="link" onClick={() => setSelectedClasses(journeyClasses.map(j => j.code))}>
                Select All
              </Button>
            </div>
            {journeyClasses.map(j => (
              <Form.Check
                key={j.code}
                label={j.label}
                type="checkbox"
                checked={selectedClasses.includes(j.code)}
                onChange={() => toggleItem(j.code, selectedClasses, setSelectedClasses)}
              />
            ))}
            {journeyClasses.length === 0 && <small className="text-muted">No class data</small>}
          </div>
        </Col>
      </Row>
      <hr />

      {/* Train Type */}
      <Row>
        <Col xs={12}><h6>TRAIN TYPE</h6></Col>
        <Col xs={12}>
          <div className="mb-1">
            <Button size="sm" variant="link" onClick={() => setSelectedTrainTypes(trainTypes)}>Select All</Button>
          </div>
          {trainTypes.map(t => (
            <Form.Check
              key={t}
              label={t}
              type="checkbox"
              checked={selectedTrainTypes.includes(t)}
              onChange={() => toggleItem(t, selectedTrainTypes, setSelectedTrainTypes)}
            />
          ))}
          {trainTypes.length === 0 && <small className="text-muted">No train type data</small>}
        </Col>
      </Row>
      <hr />

      {/* Departure time buttons (store compact values like "00:00-06:00") */}
      <Row>
        <Col xs={12}><h6>DEPARTURE TIME</h6></Col>
        <Col xs={12} className="d-flex flex-wrap">
          {timeSlots.map(slot => (
            <Button
              key={slot.value}
              size="sm"
              className="m-1"
              variant={selectedDepartureTimes.includes(slot.value) ? "primary" : "outline-secondary"}
              onClick={() => toggleItem(slot.value, selectedDepartureTimes, setSelectedDepartureTimes)}
            >
              {slot.label}
            </Button>
          ))}
        </Col>
      </Row>
      <hr />

      {/* Arrival time */}
      <Row>
        <Col xs={12}><h6>ARRIVAL TIME</h6></Col>
        <Col xs={12} className="d-flex flex-wrap">
          {timeSlots.map(slot => (
            <Button
              key={slot.value + "-arr"}
              size="sm"
              className="m-1"
              variant={selectedArrivalTimes.includes(slot.value) ? "primary" : "outline-secondary"}
              onClick={() => toggleItem(slot.value, selectedArrivalTimes, setSelectedArrivalTimes)}
            >
              {slot.label}
            </Button>
          ))}
        </Col>
      </Row>
      <hr />

      {/* Days of operation */}
      <Row>
        <Col xs={12}><h6>DAYS</h6></Col>
        <Col xs={12}>
          {daysOfWeek.map(d => (
            <Form.Check
              key={d}
              type="checkbox"
              label={d}
              checked={selectedDays.includes(d)}
              onChange={() => toggleItem(d, selectedDays, setSelectedDays)}
            />
          ))}
        </Col>
      </Row>
      <hr />

      {/* Fare range - simple single-handle to filter by max fare */}
      <Row>
        <Col xs={12}>
          <h6>FARE (max)</h6>
          <Form.Range
            min={minFare}
            max={maxFare}
            value={fareRange[1] ?? maxFare}
            onChange={(e) => setFareRange([minFare, parseInt(e.target.value, 10)])}
          />
          <small>Showing trains with starting fare ≤ ₹{fareRange[1]}</small>
        </Col>
      </Row>
      <hr />
    </Container>
  );
};

export default FilterSidebar;
