import React, { useState } from "react";
import { errorMessage, successMessaage } from "../Utils/Toastify.jsx";
import "react-toastify/dist/ReactToastify.css";

const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const apiUrl = `${backend_url}/form/add`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      errorMessage("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorMessage(data.message || "Something went wrong!");
        setLoading(false);
        return;
      }

      successMessaage(data.message || "Form submitted successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      errorMessage("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-12">
            <form onSubmit={handleSubmit}>
              <h4>Contact Us</h4>

              <div className="mb-2">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-outline-danger rounded-5 text-uppercase px-5 mt-4"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
