import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import TogglePasswordType from "../Utils/TogglePasswordType";
import { errorMessage, successMessaage } from "../Utils/Toastify";
import LoginContext from "../context/userContext/userContext";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const { loggedIn, setLoggedIn, userData, setUserData } =
    useContext(LoginContext);
  const { handleTogglePassword, showPassword } = TogglePasswordType();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api_url = `${backend_url}/user/login`;
      const response = await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log("loign data::", data);
      if (data.success == false) {
        errorMessage(data.message);
      } else {
        successMessaage(data.message);
        setLoggedIn(true);
        console.log("login data::", data);
        console.log("login data::", data.role);

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);
        localStorage.setItem("photo", data.photo);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userRole", data.role);
        setUser({
          email: "",
          password: "",
        });
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login">
      <Form onSubmit={handleSubmit}>
        <h3 className="text-center text-uppercase p-2">Login</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 passwordDiv" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            minLength={8}
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          <i
            onClick={handleTogglePassword}
            className={`fa-solid  ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
          ></i>
        </Form.Group>
        <Button variant="outline-danger" size="md" type="submit">
          Submit
        </Button>
        <div className="text-center">
          <h5>OR</h5>
          <h6>
            Create an account{" "}
            <NavLink to="/signup" className="text-primary">
              Signup
            </NavLink>
          </h6>
        </div>
      </Form>
    </div>
  );
};

export default Login;
