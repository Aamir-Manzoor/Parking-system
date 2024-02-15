// Slot.js
import "../../index.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import { Button, Modal, Form } from "react-bootstrap";

const Slot = () => {
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [floors, setFloors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    floorId: "",
    occupied: false,
  });

  useEffect(() => {
    fetchSlots();
    fetchFloors();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      type: "",
      floorId: "",
      occupied: false,
    });
  };

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const response = await axios.get("http://localhost:8800/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleAddSlot = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8800/slots", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlots();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding slot:", error);
    }
  };

  const handleUpdateSlot = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8800/slots/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlots();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating slot:", error);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8800/slots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlots();
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };

  const fetchFloors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8800/floors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFloors(response.data);
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <div className="container mt-4 d-flex justify-content-between align-items-center">
          <h2 className="text-primary mb-0">Slots</h2>
          <Button variant="primary btn-no-hover2" onClick={handleShowModal}>
            Add Slot
          </Button>
        </div>

        <table className="table mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Floor ID</th>
              <th>Occupied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.ID}>
                <td>{slot.ID}</td>
                <td>{slot.Name}</td>
                <td>{slot.Type}</td>
                <td>{slot.FloorID}</td>
                <td>{slot.Occupied ? "Yes" : "No"}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => {
                      setFormData(slot);
                      handleShowModal();
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger btn-no-hover"
                    onClick={() => handleDeleteSlot(slot.ID)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.ID ? "Edit Slot" : "Add Slot"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter slot name"
                name="name"
                value={formData.Name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter slot type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Floor ID</Form.Label>
              <Form.Select
                name="floorId"
                value={formData.floorId}
                onChange={handleInputChange}
              >
                <option value="">Select Floor ID</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Occupied"
                name="occupied"
                checked={formData.occupied}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary btn-no-hover" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary btn-no-hover2"
            onClick={() =>
              formData.id ? handleUpdateSlot(formData.id) : handleAddSlot()
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Slot;
