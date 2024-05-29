import React from "react";
import { Card, Table, Container, Button } from "react-bootstrap";

const EventList = ({ events, onAdd }) => {
  return (
    <div className="mx-5">
      <Container className="mt-4">
        <Card
          className="p-3 shadow-sm"
          style={{
            borderRadius: "15px",
            backgroundColor: "#f8f9fa",
            minWidth: "600px",
          }}
        >
          <h2 className="text-center mb-4">Community Events</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            <Button variant="primary" onClick={onAdd}>
              Add Event
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default EventList;
