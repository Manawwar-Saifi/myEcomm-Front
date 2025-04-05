import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { successMessaage, errorMessage } from "../../Utils/Toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const AddCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const getingData = `${backend_url}/category/single/${id}`;
  const updateUrl = `${backend_url}/category/update/${id}`;

  useEffect(() => {
    const singleCategory = async () => {
      try {
        const response = await fetch(getingData);
        const result = await response.json();
        if (response.ok) {
          setName(result.category.name);
          setDescription(result.category.description);
          setImage(result.category.photo);
          setStatus(result.category.status);
        } else {
          errorMessage("Failed to fetch category");
        }
      } catch (err) {
        errorMessage(`Something went wrong: ${err.message}`);
      }
    };
    singleCategory();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setNewImage(file); // Save the file for submission
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("status", status);
    if (newImage) {
      formData.append("photo", newImage); // Add new image if uploaded
    }

    try {
      const response = await fetch(updateUrl, {
        method: "PUT",
        body: formData, // Send FormData directly
      });

      const result = await response.json();
      console.log(response);
      console.log(result);
      if (response.ok) {
        successMessaage(result.message || "Category updated successfully-C.");
        setTimeout(() => {
          navigate("/admin/category");
        }, 1500);
      } else {
        errorMessage(result.message || "Failed to update category");
      }
    } catch (err) {
      errorMessage(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="add-category">
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center flex-column mb-4">
            <h3 className="text-center text-uppercase p-2">Update Category</h3>
            <NavLink to="/admin/category" className="btn btn-outline-danger">
              <i className="fa-solid fa-arrow-left mx-2"></i>Back
            </NavLink>
          </div>

          <div className="row">
            <Form.Group className="mb-3 col-6" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-6" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="row">
            <Form.Group className="mb-3 col-6" controlId="formImage">
              <Form.Label>Select New Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            <div className="col-6">
              <h5>Current Image</h5>
              {image && (
                <img
                  src={`${image}`}
                  className="w-50"
                  alt="Category"
                />
              )}
            </div>
          </div>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button variant="outline-danger" type="submit">
            Update Category
          </Button>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCategory;
