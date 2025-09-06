import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Badge, Button, Table } from 'react-bootstrap';

const MyTicketsPage = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        setTickets(storedBookings);
    }, []);

    const handleCancelTicket = (ticketToCancel) => {
        const updatedTickets = tickets.filter(
            ticket => ticket.pnr !== ticketToCancel.pnr  
        );
        setTickets(updatedTickets);
        localStorage.setItem('bookings', JSON.stringify(updatedTickets));
    };

    if (tickets.length === 0) {
        return (
            <Container className="mt-5 text-center">
                <h4>No bookings found.</h4>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">My Tickets</h2>
            <Row>
                {tickets.map((ticket, idx) => (
                    <Col md={12} key={idx} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5>{ticket.trainName} ({ticket.trainNumber})</h5>
                                <p><strong>PNR:</strong> {ticket.pnr}</p>
                                <p><strong>From:</strong> {ticket.from} → <strong>To:</strong> {ticket.to}</p>
                                <p><strong>Date:</strong> {ticket.bookingDate}</p>
                                <p><strong>Class:</strong> {ticket.classType}</p>
                                <p><strong>Seats:</strong> {ticket.numSeats}</p>
                                <p><strong>Total Fare:</strong> ₹{ticket.fare}</p>
                                <Badge bg="success" className="me-2">Confirmed</Badge>

                                <h6 className="mt-3">Passenger Details</h6>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Age</th>
                                            <th>Gender</th>
                                            <th>Meal</th>
                                            <th>ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ticket.passengers.map((p, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{p.name}</td>
                                                <td>{p.age}</td>
                                                <td>{p.gender}</td>
                                                <td>{p.meal || "None"}</td>
                                                <td>{p.idType} - {p.idNumber}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => handleCancelTicket(ticket)}
                                >
                                    Cancel
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MyTicketsPage;
