import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import trainsData from "../merged_trains_complete.json";
import './home.css'

const Home = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const { stations = [] } = trainsData;

  const [fromDropdown, setFromDropdown] = useState(false);
  const [toDropdown, setToDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please fill all details");
      return;
    }
    navigate("/results", { state: { from, to, date } });
  };

  const filterStations = (input) =>
    stations.filter(s =>
      s.stationName.toLowerCase().includes(input.toLowerCase())
    );

  return (
    <Container fluid className="bg-img">
      <Row>
        <Col md={5} sm={12}>
          <div className="form-container">
            <h2>Book Ticket</h2>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="From"
                      value={from}
                      onChange={(e) => { setFrom(e.target.value); setFromDropdown(true); }}
                      onBlur={() => setTimeout(() => setFromDropdown(false), 150)}
                      required
                    />
                    {fromDropdown && from && (
                      <ListGroup style={{ maxHeight: "150px", overflowY: "auto", position: "absolute", zIndex: 10, width: "100%" }}>
                        {filterStations(from).map(s => (
                          <ListGroup.Item key={s.stationCode} action onClick={() => { setFrom(s.stationName); setFromDropdown(false); }}>
                            {s.stationName} ({s.stationCode})
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="To"
                      value={to}
                      onChange={(e) => { setTo(e.target.value); setToDropdown(true); }}
                      onBlur={() => setTimeout(() => setToDropdown(false), 150)}
                      required
                    />
                    {toDropdown && to && (
                      <ListGroup style={{ maxHeight: "150px", overflowY: "auto", position: "absolute", zIndex: 10, width: "100%" }}>
                        {filterStations(to).map(s => (
                          <ListGroup.Item key={s.stationCode} action onClick={() => { setTo(s.stationName); setToDropdown(false); }}>
                            {s.stationName} ({s.stationCode})
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Control
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <div className="btn-row">
                <button type="submit" className="btn-search">Search</button>
                <button type="button" className="btn-book">Easy Booking</button>
              </div>
            </form>
          </div>

          <div className="notice-bar">
            <p>
              <strong>Festival Round Trip Scheme: User Guide and Terms & Conditions</strong><br />
              Customers can use enhanced interface for their IRCTC related queries!!
              <a href="https://equery.irctc.co.in" target="_blank" rel="noopener noreferrer"> https://equery.irctc.co.in</a><br />
              <strong>Customer Care Numbers :</strong> 14646
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
