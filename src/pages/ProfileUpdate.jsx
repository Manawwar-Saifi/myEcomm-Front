import React, { useEffect, useState } from "react";

const ProfileUpdate = () => {
  const [getUser, setGetUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const userId = localStorage.getItem("userId");

  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const getUserApi = `${backend_url}/user/single-user/${userId}`;

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!userId) return;
        const response = await fetch(getUserApi);
        const result = await response.json();
        setGetUser(result.data || {}); // Ensure it's an object
      } catch (error) {
        console.log(error.message);
      }
    };

    getUserData();
  }, [userId]); // Ensure it refetches when userId changes

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGetUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(getUser).forEach((key) => {
      formData.append(key, getUser[key]);
    });

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    try {
      const response = await fetch(
        `${backend_url}/user/update-user/${userId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Hisis reuslut :::87", result);
      if (result.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  return (
    <div className="update-profile">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-lx-8 col-md-8 col-sm-12 mainDivAfterRow">
            <div className="ImageDiv d-flex justify-content-center align-items-center">
              <h5>Current Image</h5>
              <img src={`${getUser.photo}`} alt="User Image" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row justify-content-center">
                <div className="mb-3 col-lg-4 col-md-4 col-sm-12">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={getUser.name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-4 col-sm-12">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={getUser.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-4 col-sm-12">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={getUser.phone || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="mb-3 col-lg-4 col-md-4 col-sm-12">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={getUser.country || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-4 col-sm-12">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={getUser.state || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-4 col-sm-12">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={getUser.city || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="mb-3 col-lg-4 col-md-4 col-sm-12">
                  <label className="form-label">Pincode</label>
                  <input
                    type="number"
                    className="form-control"
                    name="pincode"
                    value={getUser.pincode || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 col-lg-8 col-md-8 col-sm-12">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={getUser.address || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Select New Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn btn-outline-primary">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
