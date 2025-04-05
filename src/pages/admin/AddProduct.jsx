import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { errorMessage, successMessaage } from "../../Utils/Toastify";
import { ToastContainer } from "react-toastify";
const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    regular_price: "",
    selling_price: "",
    categories: [],
    stock: "",
    status: "active",
  });
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const navigate = useNavigate();

  const [featuredImage, setFeaturedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]); // Fetch categories dynamically
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backend_url}/category/all`);
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedCategories = checked
        ? [...prev.categories, value]
        : prev.categories.filter((cat) => cat !== value);
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleFeaturedImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("sku", formData.sku);
    data.append("regular_price", formData.regular_price);
    data.append("selling_price", formData.selling_price);
    data.append("stock", formData.stock);
    data.append("status", formData.status);

    formData.categories.forEach((cat) => data.append("categories", cat));

    if (featuredImage) {
      data.append("featuredImage", featuredImage);
    }

    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await fetch(`${backend_url}/product/add`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        successMessaage("Product added successfully!");
        setFormData({
          name: "",
          description: "",
          sku: "",
          regular_price: "",
          selling_price: "",
          categories: [],
          stock: "",
          status: "active",
        });
        setFeaturedImage(null);
        setImages([]);

        setTimeout(() => {
          navigate("/admin/product");
        }, 2000);
      } else {
        const error = await response.json();
        errorMessage(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error("Request failed:", err);
      errorMessage("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <div className="row">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="col-8"
        >
          <div className="d-flex justify-content-between align-items-center py-3">
            <h5 className="text-center text-uppercase p-2">Add Product</h5>
            <NavLink to="/admin/product" className="btn btn-outline-danger">
              <i className="fa-solid fa-arrow-left mx-2"></i>Back
            </NavLink>
          </div>

          <div className="row">
            <div className="col-4">
              <label>Product Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-4">
              <label>SKU:</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-4">
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              <label>Regular Price:</label>
              <input
                type="number"
                name="regular_price"
                value={formData.regular_price}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-4">
              <label>Selling Price:</label>
              <input
                type="number"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-4">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <label>Featured Image:</label>
              <input
                type="file"
                onChange={handleFeaturedImageChange}
                accept="image/*"
              />
            </div>

            <div className="col-6">
              <label>Additional Images:</label>
              <input
                type="file"
                multiple
                onChange={handleImagesChange}
                accept="image/*"
              />
            </div>
          </div>

          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="category-section">
            <h5>Select Categories:</h5>
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category._id}>
                  <input
                    type="checkbox"
                    value={category._id}
                    onChange={handleCheckboxChange}
                    checked={formData.categories.includes(category._id)}
                  />
                  <label>{category.name}</label>
                </div>
              ))
            ) : (
              <p>Loading categories...</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-3 btn btn-outline-danger"
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
