import React from "react";
import { Row, Col, Image, Card, Container } from "react-bootstrap";

const UserProfile1 = ({ user }) => {
  const { name, email, phoneNumber, createdAt } = user;

  return (
    <div className="mx-5">
      <Container className="mt-2">
        <Card
          className="p-4 shadow-sm"
          style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}
        >
          <h2 className="text-center mb-4">Welcome to Your Community Garden Dashboard</h2>
          <p className="text-center mb-4">
            This is your central hub for managing and viewing all activities related to your community garden.
            Here you can view your plots, track activities, manage resources, and stay updated on upcoming events.
            Use the sections above to navigate through different aspects of your community garden.
          </p>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12} className="d-flex justify-content-center mb-3">
              <Image
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="avatar"
                className="rounded-circle"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </Col>
            <Col xs={12} className="text-center">
              <h3>{name}</h3>
              <p className="text-muted mb-1">{email}</p>
              <p className="text-muted mb-1">{phoneNumber}</p>
              <p className="text-muted mb-1">
                Member Since: {new Date(createdAt).toLocaleDateString()}
              </p>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile1;
