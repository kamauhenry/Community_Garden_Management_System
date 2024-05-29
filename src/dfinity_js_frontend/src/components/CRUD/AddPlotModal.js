import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddPlotModal = ({ show, handleClose, handleSave, userId }) => {
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [reservedUntil, setReservedUntil] = useState("");

  const onSave = () => {
    if (!size || !location || !reservedUntil) {
      alert("All fields are required.");
      return;
    }
    handleSave({ userId, size, location, reservedUntil });
    handleClose();
  };
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Plot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Size</Form.Label>
            <Form.Control
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Reserved Until</Form.Label>
            <Form.Control
              type="date"
              value={reservedUntil}
              onChange={(e) => setReservedUntil(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Plot
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPlotModal;
