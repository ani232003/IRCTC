import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./footer.css";  

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-top py-5">
    
          <Col md={3}>
            <h5 className="footer-title">IRCTC</h5>
            <p className="footer-text">
              Indian Railway Catering and Tourism Corporation Limited.  
              Book tickets, tourism packages, catering services and more.
            </p>
          </Col>

          <Col md={3}>
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-list">
              <li><a href="/">Home</a></li>
              <li><a href="/trains">Train Schedule</a></li>
              <li><a href="/booking">Ticket Booking</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="footer-title">Customer Support</h6>
            <ul className="footer-list">
              <li>Helpline: 139</li>
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/feedback">Feedback</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="footer-title">Follow Us</h6>
            <div className="footer-social">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </Col>
        </Row>

        <Row>
          <Col className="footer-bottom text-center py-3">
            © {new Date().getFullYear()} IRCTC | Govt. of India
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
