import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import Register from "./components/Auth/Register";
import Floor from "./components/Dashboard/Floor";
import Slot from "./components/Dashboard/Slot";
import Details from "./components/Home/Details";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; 
};

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/floor" element={<ProtectedRoute element={<Floor />} />} />
          <Route path="/slot" element={<ProtectedRoute element={<Slot />} />} />
          <Route path="/details" element={<ProtectedRoute element={<Details />} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
