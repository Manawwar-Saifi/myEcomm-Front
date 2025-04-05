import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import TogglePasswordType from "../Utils/TogglePasswordType";
import { useState } from "react";
import { successMessaage, errorMessage } from "../Utils/Toastify";
const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const navigate = useNavigate();

  const { handleTogglePassword, showPassword } = TogglePasswordType();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    // console.log(e.target.name," ",e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api_url = `${backend_url}/user/signup`;
      const res = await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      // console.log(data)
      if (data.success === true) {
        successMessaage(data.message);
        setUser({
          name: "",
          email: "",
          phone: "",
          password: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        errorMessage(data.message);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      errorMessage(data.message);
    }
  };

  return (
    <div className="signup">
      <Form onSubmit={handleSubmit}>
        <h3 className="text-center text-uppercase p-2">Signup</h3>

        <div className="row">
          <Form.Group className="mb-3 col-6" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter name"
              required
              value={user.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 col-6" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              required
              value={user.email}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            placeholder="Enter phone"
            required
            minLength={10}
            value={user.phone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 passwordDiv" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            required
            minLength={8}
            value={user.password}
            onChange={handleChange}
          />
          <i
            onClick={handleTogglePassword}
            className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
          ></i>
        </Form.Group>
        <Button variant="outline-danger" size="md" type="submit">
          Submit
        </Button>
        <div className="text-center">
          <h5>OR</h5>
          <h6>
            Already have an account?{" "}
            <NavLink to="/login" className="text-primary">
              Login Now
            </NavLink>
          </h6>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
