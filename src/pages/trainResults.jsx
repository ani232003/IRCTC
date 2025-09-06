/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { auth } from "../firebase";  // Firebase auth
import trainsData from "../merged_trains_complete.json";
import FilterSidebar from "./filter";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from = "", to = "", date = "" } = location.state || {};

  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);

  // Filters
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedTrainTypes, setSelectedTrainTypes] = useState([]);
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState([]);
  const [selectedArrivalTimes, setSelectedArrivalTimes] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [fareRange, setFareRange] = useState([0, 100000]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const { stations = [], trains: allTrains = [] } = trainsData || {};

  // Map station codes -> names
  const stationNameByCode = useMemo(() => {
    const map = new Map();
    stations.forEach((s) => s.stationCode && map.set(s.stationCode, s.stationName));
    return map;
  }, [stations]);

  const getStationName = (code) => stationNameByCode.get(code) || code;

  // Parse time slot "00:00-06:00"
  const parseSlot = (slot) => {
    if (!slot) return null;
    const [startStr, endStr] = slot.split("-");
    return { start: parseInt(startStr.split(":")[0], 10) || 0, end: parseInt(endStr.split(":")[0], 10) || 24 };
  };

  // Resolve station code
  const resolveStationCode = (input) => {
    if (!input) return null;
    const norm = input.trim().toLowerCase();
    const exactName = stations.find((s) => s.stationName?.toLowerCase() === norm);
    if (exactName) return exactName.stationCode;
    const exactCode = stations.find((s) => s.stationCode?.toLowerCase() === norm);
    if (exactCode) return exactCode.stationCode;
    const partial = stations.find((s) => s.stationName?.toLowerCase().includes(norm));
    return partial ? partial.stationCode : input;
  };

  // Load trains for route
  useEffect(() => {
    if (!from || !to) return setTrains([]);
    const fromCode = resolveStationCode(from);
    const toCode = resolveStationCode(to);

    const routeTrains = allTrains.filter(
      (t) => t.sourceCode === fromCode && t.destinationCode === toCode
    );
    setTrains(routeTrains);

    // Set fare range
    const fares = routeTrains.flatMap((t) =>
      Object.values(t.classesFare || {}).map((f) => f.price || f.base_fare || 0)
    );
    setFareRange(fares.length ? [Math.min(...fares), Math.max(...fares)] : [0, 100000]);
  }, [from, to, allTrains, stations]);

  // Apply filters
  useEffect(() => {
    let result = [...trains];

    if (selectedClasses.length)
      result = result.filter((t) => t.classes?.some((c) => selectedClasses.includes(c)));

    if (selectedTrainTypes.length)
      result = result.filter((t) =>
        selectedTrainTypes.some((type) => (t.trainName || "").toUpperCase().includes(type))
      );

    if (selectedDepartureTimes.length)
      result = result.filter((t) => {
        const depHour = parseInt((t.departureTime || "0:00").split(":")[0], 10);
        return selectedDepartureTimes.some((slot) => {
          const s = parseSlot(slot);
          return s && depHour >= s.start && depHour < s.end;
        });
      });

    if (selectedArrivalTimes.length)
      result = result.filter((t) => {
        const arrHour = parseInt((t.arrivalTime || "0:00").split(":")[0], 10);
        return selectedArrivalTimes.some((slot) => {
          const s = parseSlot(slot);
          return s && arrHour >= s.start && arrHour < s.end;
        });
      });

    if (selectedDays.length)
      result = result.filter((t) => Array.isArray(t.days) && t.days.some((d) => selectedDays.includes(d)));

    if (fareRange.length === 2) {
      const maxFare = fareRange[1];
      result = result.filter((t) => {
        const fares = Object.values(t.classesFare || {}).map((f) => f.price || f.base_fare || Infinity);
        return fares.length && Math.min(...fares) <= maxFare;
      });
    }

    if (onlyAvailable)
      result = result.filter((t) => {
        const avail = t.availability?.[date];
        if (!avail) return false;
        return Object.values(avail).some((v) => {
          if (!v) return false;
          const str = v.toString().toUpperCase();
          return (!isNaN(str) && parseInt(str, 10) > 0) || str.includes("AVAILABLE");
        });
      });

    setFilteredTrains(result);
  }, [
    trains,
    selectedClasses,
    selectedTrainTypes,
    selectedDepartureTimes,
    selectedArrivalTimes,
    selectedDays,
    fareRange,
    onlyAvailable,
    date
  ]);

  // Handle booking
  const handleBook = (train) => {
    if (!auth.currentUser) { // Check Firebase auth directly
      navigate("/login", { state: { from: "/results", train } });
    } else {
      navigate("/book", { state: { trainNumber: train.trainNumber, searchDate: date } });
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3} className="mb-5">
          <FilterSidebar
            allTrains={trains}
            selectedClasses={selectedClasses}
            setSelectedClasses={setSelectedClasses}
            selectedTrainTypes={selectedTrainTypes}
            setSelectedTrainTypes={setSelectedTrainTypes}
            selectedDepartureTimes={selectedDepartureTimes}
            setSelectedDepartureTimes={setSelectedDepartureTimes}
            selectedArrivalTimes={selectedArrivalTimes}
            setSelectedArrivalTimes={setSelectedArrivalTimes}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
            fareRange={fareRange}
            setFareRange={setFareRange}
            onlyAvailable={onlyAvailable}
            setOnlyAvailable={setOnlyAvailable}
          />
        </Col>

        <Col md={9}>
          <h2 className="text-center mb-4">
            Trains from <span className="text-primary">{from || "N/A"}</span> to{" "}
            <span className="text-success">{to || "N/A"}</span>{" "}
            {date && <Badge bg="secondary" className="ms-2">{date}</Badge>}
          </h2>

          {filteredTrains.length === 0 ? (
            <p className="text-center text-danger">No trains found for your selected route / filters.</p>
          ) : (
            <Row>
              {filteredTrains.map((train) => (
                <Col md={12} key={train.trainNumber} className="mb-3">
                  <Card className="p-3 shadow border-start border-4 border-primary">
                    <Card.Body>
                      <Row className="align-items-center bg-light p-2 rounded mb-2">
                        <Col md={8}>
                          <h6 className="fw-bold mb-0">
                            {train.trainName} ({train.trainNumber})
                            <Badge
                              bg={train.dataQuality === "estimated" ? "warning" : "success"}
                              text={train.dataQuality === "estimated" ? "dark" : ""}
                              className="ms-2"
                            >
                              {train.dataQuality === "estimated" ? "Estimated" : "Official"}
                            </Badge>
                          </h6>
                          <small className="text-muted">
                            Runs On: {Array.isArray(train.days) ? train.days.join(" ") : "N/A"}
                          </small>
                        </Col>
                        <Col md={4} className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/trainDetails`, { state: { train } })}
                          >
                            Train Details
                          </Button>
                        </Col>
                      </Row>

                      <Row className="align-items-center text-center my-2">
                        <Col>
                          <h5 className="fw-bold">{train.departureTime || "N/A"}</h5>
                          <p className="mb-0 fs-7">{getStationName(train.sourceCode)} | {date}</p>
                        </Col>
                        <Col><span className="text-muted">── {train.duration || "N/A"} ──</span></Col>
                        <Col>
                          <h5 className="fw-bold">{train.arrivalTime || "N/A"}</h5>
                          <p className="mb-0 fs-7">{getStationName(train.destinationCode)} | {date}</p>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        {Array.isArray(train.classes) && train.classes.length ? (
                          train.classes.map((cls, idx) => (
                            <Col key={idx} xs="auto" className="mb-2">
                              <Badge pill bg="light" text="dark" className="px-3 py-2">{cls}</Badge>
                            </Col>
                          ))
                        ) : <p className="text-muted">No Classes Available</p>}
                      </Row>

                      <p className="small text-muted mb-1">
                        {train.classesFare && Object.keys(train.classesFare).length
                          ? `Approx. starting fare: ₹${Math.min(...Object.values(train.classesFare).map(f => f.price || f.base_fare || Infinity))}`
                          : "Fare info not available"}
                      </p>

                      <div className="d-flex gap-2 mt-2">
                        <Button variant="warning" size="sm" onClick={() => handleBook(train)}>Book</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Results;
