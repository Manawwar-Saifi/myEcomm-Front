import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { NavLink } from "react-router-dom";
import { errorMessage, successMessaage } from "../../Utils/Toastify";
import { ToastContainer } from "react-toastify";
const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [photo, setPhoto] = useState(null);

  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BASE_API_URL;
  // console.log(backend_url, "ljflsjdfldskj");
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setMessage("Name and Photo are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("photo", photo);

    try {
      const response = await fetch(`${backend_url}/category/add`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result, "result");
      console.log(response, "::response");
      if (response.ok) {
        setName("");
        setDescription("");
        setStatus("");
        setDescription("");
        setPhoto("");
        successMessaage("Category Added Successfully.");
        setTimeout(() => {
          navigate("/admin/category");
        }, 2000);
      } else {
        errorMessage(`${result.message} || Error adding category|||||||||.`);
      }
    } catch (error) {
      errorMessage(`${error} An error occurred while adding the category.`);
    }
  };

  return (
    <div>
      <div className="add-category">
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between alige-items-center flex-column mb-4">
            <h3 className="text-center text-uppercase p-2">Add Category</h3>
            <NavLink to="/admin/category" className="btn btn-outline-danger">
              <i className="fa-solid fa-arrow-left mx-2"></i>Back
            </NavLink>
          </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 passwordDiv"
            controlId="formBasicPassword"
          >
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">InActive</option>
            </Form.Select>
          </Form.Group>
          <Form.Group
            className="mb-3 passwordDiv"
            controlId="formBasicPassword"
          >
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={3}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button variant="outline-danger" size="md" type="submit">
            Add Category
          </Button>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCategory;
