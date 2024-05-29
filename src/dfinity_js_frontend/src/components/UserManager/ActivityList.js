import React from "react";
import { Card, Table, Container, Button } from "react-bootstrap";

const ActivityList = ({ activities, onAdd }) => {
  return (
    <div className="mx-5">
      <Container className="mt-2">
        <Card
          className="p-3 shadow-sm"
          style={{
            borderRadius: "15px",
            backgroundColor: "#f8f9fa",
            minWidth: "650px",
          }}
        >
          <h2 className="text-center mb-4">Your Activities</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Activity ID</th>
                <th>Description</th>
                <th>Date</th>
                <th>Plot ID</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td>{activity.description}</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                  <td>{activity.plotId}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            <Button variant="primary" onClick={onAdd}>
              Add Activity
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default ActivityList;
