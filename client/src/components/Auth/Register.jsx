import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8800/SignUp", values);
      console.log(response.data);

      toast.success("User registered successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });

      // Navigate to the login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response.data.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-cyan-200 flex items-center justify-center">
      <div className="bg-slate-50 rounded-md py-10 px-4 ">
        <h2 className="text-2xl text-center font-bold text-green-900 ">
          Sign up
        </h2>
        <form
          action=""
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-2"
        >
          <div className="w-96 flex flex-col gap-1 text-lg  p-2 rounded-md ">
            <label htmlFor="name">Name :</label>
            <input
              required
              autoComplete="name"
              id="name"
              name="name"
              type="text"
              placeholder="Enter Your Name"
              className="outline-none border border-black rounded-md py-1 px-2"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div className="w-96 flex flex-col gap-1 text-lg  p-2 rounded-md ">
            <label htmlFor="email">Email : </label>
            <input
              required
              autoComplete="email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter Email"
              className="outline-none border border-black rounded-md py-1 px-2"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>

          <div className="w-96 flex flex-col gap-1 text-lg  p-2 rounded-md  ">
            <label htmlFor="password">Password :</label>
            <input
              required
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
              className="outline-none border border-black rounded-md py-1 px-2"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="px-8 py-2 border font-bold border-black rounded-md bg-green-400 text-white"
          >
            Sign up
          </button>
          <p>Agree to Terms and Policies</p>
          <Link
            to="/login"
            className="px-8 py-2 font-bold text-center border border-black rounded-md bg-green-400 text-white"
          >
            Login
          </Link>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
