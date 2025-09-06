import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Badge, Modal } from 'react-bootstrap';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails } = location.state || {};

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pnr, setPnr] = useState(null);

    useEffect(() => {
        if (!bookingDetails) {
            alert('No booking details found. Redirecting to search.');
            navigate('/');
        }
    }, [bookingDetails, navigate]);

  
    const generatePNR = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!cardNumber || !expiry || !cvv) {
            setError('Please fill all payment fields.');
            setLoading(false);
            return;
        }
        if (!/^\d{16}$/.test(cardNumber)) {
            setError('Card number must be 16 digits.');
            setLoading(false);
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            setError('Expiry must be in MM/YY format.');
            setLoading(false);
            return;
        }
        if (!/^\d{3}$/.test(cvv)) {
            setError('CVV must be 3 digits.');
            setLoading(false);
            return;
        }

        // Simulate payment processing
        setTimeout(() => {
            try {
                const generatedPNR = generatePNR();
                setPnr(generatedPNR);

                // Add PNR into booking details
                const confirmedBooking = { ...bookingDetails, pnr: generatedPNR };

                // Save booking in localStorage
                const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
                localStorage.setItem('bookings', JSON.stringify([...storedBookings, confirmedBooking]));

                setShowModal(true);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to save booking.');
                setLoading(false);
            }
        }, 1500);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleGoHome = () => {
        navigate('/');
    };

    if (!bookingDetails) return null;

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Payment Page</h2>
            <Card className="p-4 mb-5 shadow">
                <Card.Body>
                    <Row className="mb-3">
                        <Col>
                            <h5>Booking Summary</h5>
                            <p>Train: {bookingDetails.trainName} ({bookingDetails.trainNumber})</p>
                            <p>Passenger: {bookingDetails.passengerName}</p>
                            <p>Class: {bookingDetails.classType}</p>
                            <p>Seats: {bookingDetails.numSeats}</p>
                            <p>Total Fare: ₹{bookingDetails.fare}</p>
                            <p>Date: {bookingDetails.bookingDate}</p>
                        </Col>
                    </Row>

                    <hr />
                    {error && <div className="text-danger mb-3">{error}</div>}

                    <Form onSubmit={handlePaymentSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="1234123412341234"
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                                maxLength={16}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Expiry (MM/YY)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={e => setExpiry(e.target.value)}
                                        maxLength={5}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="123"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value)}
                                        maxLength={3}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="success" type="submit" className="w-100" disabled={loading}>
                            {loading ? 'Processing Payment...' : 'Pay ₹' + bookingDetails.fare}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={handleGoHome} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Confirmed!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Booking Details</h5>
                    <p>PNR: <strong>{pnr}</strong></p>
                    <p>Train: {bookingDetails.trainName} ({bookingDetails.trainNumber})</p>
                    <p>Passenger: {bookingDetails.passengerName}</p>
                    <p>Class: {bookingDetails.classType}</p>
                    <p>Seats: {bookingDetails.numSeats}</p>
                    <p>Total Fare: ₹{bookingDetails.fare}</p>
                    <p>Date: {bookingDetails.bookingDate}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePrint}>Print Ticket</Button>
                    <Button variant="secondary" onClick={handleGoHome}>Go to Home</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PaymentPage;
