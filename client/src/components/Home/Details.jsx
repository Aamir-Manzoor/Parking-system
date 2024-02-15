import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import Navigation from "../Dashboard/Navigation";

const Details = () => {
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8800/cdetails/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const handleEndParkingSession = async (carNumber, slot_id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8800/cdetails/delete/${carNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.put(
        `http://localhost:8800/slots/updateOccupancy/${slot_id}`,
        {
          occupied: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Parking session ended successfully!");

      fetchUserDetails();
    } catch (error) {
      console.error("Error ending parking session:", error);
    }
  };

  return (
    <div>
      <Navigation />
      <h2 className="text-center font-extrabold text-[35px] mb-4">
        User Parked Car Details
      </h2>
      <div className="mx-20">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slot ID</th>
              <th>Car Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userDetails.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.slot_id}</td>
                <td>{user.car_number}</td>
                <td>
                  <Button
                    variant="danger btn-no-hover"
                    onClick={() =>
                      handleEndParkingSession(user.car_number, user.slot_id)
                    }
                  >
                    End Parking Session
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Details;
