import React from "react";
import { Card, Table, Container, Button } from "react-bootstrap";

const PlotList = ({ plots, onAdd }) => {
  return (
    <div className="mx-5">
      <Container className="mt-2">
        <Card
          className="p-3 shadow-sm"
          style={{
            borderRadius: "15px",
            backgroundColor: "#f8f9fa",
            minWidth: "600px",
          }}
        >
          <h2 className="text-center mb-4">Your Plots</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Plot ID</th>
                <th>Size</th>
                <th>Location</th>
                <th>Reserved Until</th>
              </tr>
            </thead>
            <tbody>
              {plots.map((plot) => (
                <tr key={plot.id}>
                  <td>{plot.id}</td>
                  <td>{plot.size}</td>
                  <td>{plot.location}</td>
                  <td>{new Date(plot.reservedUntil).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            <Button variant="primary" onClick={onAdd}>
              Add Plot
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default PlotList;
