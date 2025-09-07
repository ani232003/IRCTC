import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { onAuthStateChanged, signOut } from "firebase/auth";   
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";   
import irctc from "../assets/irctc.png";
import logo from "../assets/logo.webp"
import "./header.css";

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // PNR state
  const [showPNRModal, setShowPNRModal] = useState(false);
  const [pnrInput, setPnrInput] = useState("");
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); 
  };

  const handlePNRSearch = () => {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const foundTicket = bookings.find(t => String(t.pnr) === pnrInput);
    setTicket(foundTicket || null);
  };

  return (
    <header className="bg-light shadow-sm sticky-top"> 
      <Container fluid>
        <Row className="py-3 align-items-center">
          <Col md={2} className="d-flex justify-content-start">
            <img src={irctc} alt="IRCTC Logo" className="logo" />
          </Col>

          <Col md={8}>
            <nav className="header-nav d-flex align-items-center justify-content-center">
              {user ? (
                <>
                  <span className="me-2">
                    Welcome, {user.displayName || user.email}!
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button className="login-btn ms-3" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button className="register-btn ms-3" onClick={() => navigate("/register")}>
                    Register
                  </Button>
                </>
              )}

              <Link to="/" className="mx-3">Home</Link>
              <Link to="/results" className="mx-3">Trains</Link>
              <Link to="/my-tickets" className="mx-3">My Tickets</Link>

              {/* PNR Button */}
              <Button
                variant="outline-primary"
                size="sm"
                className="ms-3"
                onClick={() => setShowPNRModal(true)}
              >
                PNR Status
              </Button>

              <span className="ms-3">
                {time.toLocaleDateString("en-GB")} [{time.toLocaleTimeString("en-GB", { hour12: false })}]
              </span>
            </nav>
          </Col>

          <Col md={2} className="d-flex justify-content-end">
            <img src={logo} alt="IRCTC Logo" className="logo" />
          </Col>
        </Row>
      </Container>

      {/* PNR Modal */}
      <Modal show={showPNRModal} onHide={() => setShowPNRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Check PNR Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter PNR</Form.Label>
            <Form.Control
              type="text"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
            />
          </Form.Group>
          <Button className="mt-3" onClick={handlePNRSearch}>Search</Button>

          {ticket ? (
            <div className="mt-3">
              <h5>Ticket Details</h5>
              <p><strong>PNR:</strong> {ticket.pnr}</p>
              <p><strong>Passenger:</strong> {ticket.passengerName}</p>
              <p><strong>Train:</strong> {ticket.trainName} ({ticket.trainNumber})</p>
              <p><strong>Date:</strong> {ticket.bookingDate}</p>
              <p><strong>Class:</strong> {ticket.classType}</p>
              <p><strong>Seats:</strong> {ticket.numSeats}</p>
              <p><strong>Status:</strong> Confirmed</p>
            </div>
          ) : pnrInput ? (
            <p className="mt-3 text-danger">No ticket found for this PNR.</p>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPNRModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
};

export default Header;
