/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Navigation from "./Navigation";

import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";

const Floor = () => {
  const [floors, setFloors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState({});
  const apiUrl = "http://localhost:8800/floors";
  const loadFloors = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming 'token' is the key for your JWT token in localStorage
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, // Added a space after 'Bearer'
        },
      });
      setFloors(response.data);
    } catch (error) {
      console.error("Error loading floors:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Assuming 'token' is the key for your JWT token in localStorage
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Added Bearer and a space
        },
      });
      loadFloors();
    } catch (error) {
      console.error("Error deleting floor:", error);
    }
  };

  const handleEdit = (floor) => {
    setSelectedFloor(floor);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedFloor({});
    setShowModal(true);
  };

  const handleModalSubmit = async (data) => {
    const token = localStorage.getItem("token"); // Assuming 'token' is the key for your JWT token in localStorage
    const headers = {
      Authorization: `Bearer ${token}`, // Added Bearer and a space
      "Content-Type": "application/json",
    };

    if (selectedFloor.id) {
      // Update operation
      try {
        await axios.put(`${apiUrl}/${selectedFloor.id}`, data, { headers });
        loadFloors();
      } catch (error) {
        console.error("Error updating floor:", error);
      }
    } else {
      // Add operation
      try {
        await axios.post(apiUrl, data, { headers });
        loadFloors();
      } catch (error) {
        console.error("Error adding floor:", error);
      }
    }
  };

  useEffect(() => {
    loadFloors();
  }, []);

  return (
    <div>
    <Navigation />
    <div className="container mt-4">
      <h2>Floors</h2>
      <Button variant="primary  btn-no-hover2" onClick={handleAdd} className="mb-3">
        Add Floor
      </Button>
      <FloorList
        floors={floors}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <FloorModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        initialValues={selectedFloor}
      />
    </div>
  </div>
  );
};

export default Floor;

const FloorModal = ({ show, onHide, onSubmit, initialValues }) => {
  const [name, setName] = useState(initialValues.name || "");

  const [capacity, setCapacity] = useState(initialValues.capacity || "");

  const handleSubmit = () => {
    onSubmit({ name, capacity });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Floor Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Floor Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter floor name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCapacity">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary  btn-no-hover" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary  btn-no-hover2" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const FloorList = ({ floors, onDelete }) => {
  return (
    <>
<ul className="list-group">
        {floors.map((floor) => (
          <li key={floor.id} className="list-group-item d-flex justify-content-between align-items-center">
            {floor.name} - Capacity: {floor.capacity}
            <Button variant="danger  btn-no-hover" size="sm" onClick={() => onDelete(floor.id)} className="ml-2">
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};
