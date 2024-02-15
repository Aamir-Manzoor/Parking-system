// Navigation.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/" exact>
          Parking
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" exact>
              Homepage
            </Nav.Link>
            <Nav.Link as={NavLink} to="/floor">
              Floor
            </Nav.Link>
            <Nav.Link as={NavLink} to="/slot">
              Slots
            </Nav.Link>
            <Nav.Link as={NavLink} to="/details">
              My Parked Cars
            </Nav.Link>
          </Nav>
          <Nav>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
