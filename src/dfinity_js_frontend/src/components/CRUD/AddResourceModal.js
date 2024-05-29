import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddResourceModal = ({ show, handleClose, handleSave }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [available, setAvailable] = useState(false);

  const onSave = () => {
    if (!name || !quantity) {
      alert("All fields are required.");
      return;
    }
    handleSave({ name, quantity: Number(quantity), available });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Available</Form.Label>
            <Form.Check
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Resource
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddResourceModal;
