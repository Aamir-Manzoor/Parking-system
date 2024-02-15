import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:8800/Login", values)
      .then((res) => {
        console.log(res);

        // Store the token in localStorage
        localStorage.setItem("token", res.data.token);

        // Redirect to home page after 1 second
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setError("Invalid credentials. Please try again.");
      });
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-cyan-200 flex items-center justify-center">
      <div className="bg-slate-50 rounded-md py-10 px-4 ">
        <h2 className="text-2xl text-center font-bold text-green-900 ">
          Log In
        </h2>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-2">
          <div className="w-96 flex flex-col gap-1 text-lg  p-2 rounded-md ">
            <label htmlFor="email">Email : </label>
            <input
              autoComplete="email"
              id="email"
              required
              onChange={handleInput}
              name="email"
              type="email"
              placeholder="Enter Email"
              className="outline-none border border-black rounded-md py-1 px-2"
            />
          </div>

          <div className="w-96 flex flex-col gap-1 text-lg  p-2 rounded-md  ">
            <label htmlFor="password">Password :</label>
            <input
              required
              id="password"
              onChange={handleInput}
              name="password"
              type="password"
              placeholder="Enter Password"
              className="outline-none border border-black rounded-md py-1 px-2"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="px-8 py-2 border font-bold border-black rounded-md bg-green-400 text-white"
          >
            Log In
          </button>
          <p>Agree to Terms and Policies</p>
          <Link
            to="/register"
            className="px-8 py-2 font-bold text-center border border-black rounded-md bg-green-400 text-white"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
