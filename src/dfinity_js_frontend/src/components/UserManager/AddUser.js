import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddUser = ({ save }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const isFormFilled = name && email && phoneNumber;

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FloatingLabel controlId="floatingInput" label="Name">
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Email">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Phone Number">
                        <Form.Control
                            type="text"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </FloatingLabel>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        save({ name, email, phoneNumber });
                        setName("");
                        setEmail("");
                        setPhoneNumber("");
                    }}
                    disabled={!isFormFilled}
                >
                    Save
                </Button>
            </Modal.Footer>
        </>
    )
};

AddUser.propTypes = {
    save: PropTypes.func.isRequired
};

export default AddUser;