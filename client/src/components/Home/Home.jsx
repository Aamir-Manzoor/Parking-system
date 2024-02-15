import Navigation from "../Dashboard/Navigation";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    selectedSlot: "",
    car_number: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchAvailableSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8800/slots/available",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvailableSlots(response.data);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };
  const handleAccessParking = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8800/accessParking", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.put(
        `http://localhost:8800/slots/updateOccupancy/${formData.selectedSlot}`,
        { occupied: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Access Parking Form Data:", formData);
      console.log("Parking access successful!");

      fetchAvailableSlots();
      toast.success("Alloted A Parking lot ");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle CarNumber already exists error
        const errorMessage = error.response.data.error;
        console.error("CarNumber already exists:", errorMessage);
        toast.error(errorMessage);
      } else {
        console.error("Error accessing parking:", error);
        toast.error("An error occurred while accessing parking");
      }
    }
  };

  return (
    <div>
      <Navigation />
      <div className="container mt-4">
        <>
          <h2>Welcome to the Home Page</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Available Slots</Form.Label>
              <Form.Select
                name="selectedSlot"
                value={formData.selectedSlot}
                onChange={handleInputChange}
                className="custom-select"
              >
                <option value="" disabled>
                  Select an available slot
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot.ID} value={slot.ID}>
                    {slot.Name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Car Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your car number"
                name="car_number"
                value={formData.car_number}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button
              variant="primary btn-no-hover2"
              onClick={handleAccessParking}
            >
              Access Parking
            </Button>
          </Form>
        </>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
