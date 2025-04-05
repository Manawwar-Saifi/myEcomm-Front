import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
const CheckoutForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    country: "",
    city: "",
    state: "",
    zip: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const getUserData = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8000/user/single-user/${userId}`
        );
        const result = await response.json();

        if (result.data) {
          setFormData({
            phone: result.data.phone || "",
            country: result.data.country || "",
            city: result.data.city || "",
            state: result.data.state || "",
            zip: result.data.pincode || "",
            address: result.data.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      } finally {
        x;
        setLoading(false);
      }
    };

    getUserData();
  }, [userId]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.phone ||
      !formData.country ||
      !formData.city ||
      !formData.state ||
      !formData.zip ||
      !formData.address
    ) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/user/update-user/${userId}`,
        {
          method: "PUT", // Use PATCH instead of POST for updates
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Successfull Upate your delivery address");
        navigate("/checkout");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 checkout">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-7">
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            <form onSubmit={handleSubmit}>
              <h4>Delivery Information</h4>
              <div className="mb-2 row">
                <div className="col-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-4">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-4">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-4">
                  <label className="form-label">ZIP/PIN Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline-danger text-uppercase px-5 mt-5"
                // disabled={loading}
              >
                Proceed To Checkout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
