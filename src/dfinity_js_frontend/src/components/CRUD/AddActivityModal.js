import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddActivityModal = ({ show, handleClose, handleSave }) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [plotId, setPlotId] = useState("");

  const onSave = () => {
    if (!description || !date || !plotId) {
      alert("All fields are required.");
      return;
    }
    handleSave({ description, date, plotId });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Plot ID</Form.Label>
            <Form.Control
              type="text"
              value={plotId}
              onChange={(e) => setPlotId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Activity
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddActivityModal;
