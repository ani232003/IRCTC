import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import trainsData from "../merged_trains_complete.json";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainNumber, searchDate } = location.state || {};

  const { trains: allTrains = [] } = trainsData || {};
  const selectedTrain = allTrains.find(t => t.trainNumber === trainNumber);

  const [numSeats, setNumSeats] = useState(1);
  const [classType, setClassType] = useState(selectedTrain?.classes?.[0] || '');

  // Array of passengers
  const [passengers, setPassengers] = useState([
    { name: "", gender: "", age: "", phone: "", email: "", address: "", meal: "", idType: "", idNumber: "" }
  ]);

  const [bookingOptions, setBookingOptions] = useState({
    disability: false,
    flexibleDate: false,
    avlBerth: false,
    railwayPass: false,
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    if (!selectedTrain) {
      alert('No train found. Redirecting to search results.');
      navigate('/');
    }
  }, [selectedTrain, navigate]);

  // Adjust passengers array when numSeats changes
  useEffect(() => {
    setPassengers(prev => {
      const newPassengers = [...prev];
      if (numSeats > newPassengers.length) {
        while (newPassengers.length < numSeats) {
          newPassengers.push({ name: "", gender: "", age: "", phone: "", email: "", address: "", meal: "", idType: "", idNumber: "" });
        }
      } else {
        newPassengers.length = numSeats;
      }
      return newPassengers;
    });
  }, [numSeats]);

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleBookingOptionChange = (e) => {
    const { name, checked } = e.target;
    setBookingOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);

    // Validation
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.gender || !p.age || !p.phone || !p.email || !p.address || !p.idType || !p.idNumber) {
        setBookingError(`Please fill all fields for passenger ${i + 1}.`);
        setBookingLoading(false);
        return;
      }
      if (isNaN(p.age) || p.age <= 0) {
        setBookingError(`Age must be valid for passenger ${i + 1}.`);
        setBookingLoading(false);
        return;
      }
      if (!/^\d{10}$/.test(p.phone)) {
        setBookingError(`Phone must be 10 digits for passenger ${i + 1}.`);
        setBookingLoading(false);
        return;
      }
    }

    const bookingDetails = {
      trainNumber: selectedTrain.trainNumber,
      trainName: selectedTrain.trainName,
      from: selectedTrain.from,
      to: selectedTrain.to,
      departureTime: selectedTrain.departureTime,
      arrivalTime: selectedTrain.arrivalTime,
      bookingDate: searchDate,
      classType,
      numSeats,
      passengers,
      fare: (selectedTrain.classesFare?.[classType]?.price || 0) * passengers.length,
      ...bookingOptions
    };

    navigate('/payment', { state: { bookingDetails } });
  };

  if (!selectedTrain) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Loading train details...</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Passenger Booking Form</h2>
      <Card className="p-4 mb-5 shadow">
        <Card.Body>
          <Row className="mb-3">
            <Col md={8}>
              <h4>{selectedTrain.trainName} ({selectedTrain.trainNumber})</h4>
              <p>From: <strong>{selectedTrain.from}</strong> ({selectedTrain.departureTime})</p>
              <p>To: <strong>{selectedTrain.to}</strong> ({selectedTrain.arrivalTime})</p>
              <p>Duration: {selectedTrain.duration}</p>
              <p className="small text-muted">Runs On: {selectedTrain.days?.join(', ')}</p>
            </Col>
            <Col md={4} className="text-end">
              {searchDate && <Badge bg="primary">{searchDate}</Badge>}
            </Col>
          </Row>

          <hr />

          {bookingError && <Alert variant="danger">{bookingError}</Alert>}

          <Form onSubmit={handleBookingSubmit}>
            {/* Number of seats + class */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Seats</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={numSeats}
                    onChange={e => setNumSeats(e.target.value === '' ? 1 : parseInt(e.target.value))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class Type</Form.Label>
                  <Form.Select value={classType} onChange={e => setClassType(e.target.value)} required>
                    <option value="">Select Class</option>
                    {selectedTrain.classes?.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h5>Passenger Details</h5>

            {passengers.map((p, index) => (
              <Card className="p-3 mb-3" key={index}>
                <h6>Passenger {index + 1}</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" value={p.name} onChange={e => updatePassenger(index, "name", e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select value={p.gender} onChange={e => updatePassenger(index, "gender", e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control type="number" min="1" value={p.age} onChange={e => updatePassenger(index, "age", e.target.value)} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control type="text" value={p.phone} onChange={e => updatePassenger(index, "phone", e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email ID</Form.Label>
                      <Form.Control type="email" value={p.email} onChange={e => updatePassenger(index, "email", e.target.value)} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control type="text" value={p.address} onChange={e => updatePassenger(index, "address", e.target.value)} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ID Type</Form.Label>
                      <Form.Select value={p.idType} onChange={e => updatePassenger(index, "idType", e.target.value)} required>
                        <option value="">Select</option>
                        <option value="Aadhar">Aadhar</option>
                        <option value="Passport">Passport</option>
                        <option value="PAN">PAN</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ID Number</Form.Label>
                      <Form.Control type="text" value={p.idNumber} onChange={e => updatePassenger(index, "idNumber", e.target.value)} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Meal Preference</Form.Label>
                      <Form.Select value={p.meal} onChange={e => updatePassenger(index, "meal", e.target.value)}>
                        <option value="">None</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
            ))}

            <hr />
            <h5>Additional Options</h5>
            {Object.keys(bookingOptions).map(opt => (
              <Form.Group className="mb-2" key={opt}>
                <Form.Check
                  type="checkbox"
                  label={opt.replace(/([A-Z])/g, ' $1')}
                  name={opt}
                  checked={bookingOptions[opt]}
                  onChange={handleBookingOptionChange}
                />
              </Form.Group>
            ))}

            <Button variant="warning" type="submit" className="w-100" disabled={bookingLoading}>
              {bookingLoading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingPage;
