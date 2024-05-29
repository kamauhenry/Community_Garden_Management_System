import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomeLanding() {
  return (
    <Container className="home-container">
      <header className="hero-section text-center">
        <h1>Welcome to the Garden Platform</h1>
        <p>
          Manage your garden plots, activities, resources, and events with ease.
        </p>
        <Link to="/profile?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai">
          <Button variant="primary">Get Started</Button>
        </Link>
      </header>
      <section className="info-section text-center">
        <Row>
          <Col md={3} sm={6} xs={12} className="mb-4">
            <Card className="info-card">
              <Card.Body>
                <Card.Title>Manage Plots</Card.Title>
                <Card.Text>
                  Reserve and maintain your garden plots efficiently.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} className="mb-4">
            <Card className="info-card">
              <Card.Body>
                <Card.Title>Track Activities</Card.Title>
                <Card.Text>
                  Log and monitor your gardening activities.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} className="mb-4">
            <Card className="info-card">
              <Card.Body>
                <Card.Title>Resources</Card.Title>
                <Card.Text>Share and manage gardening resources.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} className="mb-4">
            <Card className="info-card">
              <Card.Body>
                <Card.Title>Community Events</Card.Title>
                <Card.Text>
                  Join and organize community gardening events.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default HomeLanding;
