import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { successMessaage, errorMessage } from "../../Utils/Toastify";
import { ToastContainer } from "react-toastify";
const UpdateProduct = () => {
  const [categories, setCategories] = useState([]); // Fetched categories
  const [single, setSingle] = useState({});
  const [featuredImage, setFeaturedImage] = useState(null); // State for featured image
  const [additionalImages, setImages] = useState([]); // State for additional images
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    regular_price: "",
    selling_price: "",
    categories: [],
    stock: "",
    status: "active",
    featuredImage: "",
    images: [],
  });

  const navigate = useNavigate();

  const handleFeaturedImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleDeleteImage = async (imageName, photoPublicId) => {
    try {
      const response = await fetch(
        `${backend_url}/product/delete-extra-image/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageName, photoPublicId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        successMessaage("Image deleted successfully");
        setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img !== imageName),
        }));
      } else {
        const error = await response.json();
        console.error("Error deleting image:", error);
        errorMessage("Failed to delete image: " + error.message);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      errorMessage("An error occurred while deleting the image.");
    }
  };

  const { id } = useParams();
  const singleProductUrl = `${backend_url}/product/product-details/${id}`;
  const updateSingleProductUrl = `${backend_url}/product/update/${id}`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backend_url}/category/all`);
        const result = await response.json();
        setCategories(result.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSingleProduct = async () => {
      try {
        const response = await fetch(singleProductUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setSingle(result.product || {});
        setFormData({
          name: result.product.name,
          description: result.product.description,
          sku: result.product.sku,
          regular_price: result.product.regular_price,
          selling_price: result.product.selling_price,
          categories: result.product.categories,
          stock: result.product.stock,
          status: result.product.status,
          featuredImage: result.product.featuredImage,
          images: result.product.images,
        });
      } catch (error) {
        console.error("Error fetching the product:", error);
      }
    };

    fetchCategories();
    fetchSingleProduct();
  }, [id, singleProductUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedCategories = checked
        ? [...prev.categories, value]
        : prev.categories.filter((cat) => cat !== value);
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("sku", formData.sku);
    data.append("regular_price", formData.regular_price);
    data.append("selling_price", formData.selling_price);
    formData.categories.forEach((category) => {
      data.append("categories", category);
    });
    data.append("stock", formData.stock);
    data.append("status", formData.status);

    // Add the featured image if available
    if (featuredImage) {
      data.append("featuredImage", featuredImage);
    }

    // Add additional images if available
    additionalImages.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await fetch(updateSingleProductUrl, {
        method: "PUT",
        body: data,
      });

      if (response.ok) {
        successMessaage("Product updated successfully!");
        setTimeout(() => {
          navigate("/admin/product");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        errorMessage("Failed to update product. Please check the input.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      errorMessage("An error occurred while updating the product.");
    }
  };

  return (
    <div className="add-product">
      <div className="row">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="col-lg-12"
        >
          <div className="d-flex justify-content-between align-items-center py-3">
            <h5 className="text-center text-uppercase p-2">Update Product</h5>
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
                value={formData.name || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-4">
              <label>SKU:</label>
              <input
                type="text"
                name="sku"
                value={formData.sku || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-4">
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock || ""}
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
                value={formData.regular_price || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-4">
              <label>Selling Price:</label>
              <input
                type="number"
                name="selling_price"
                value={formData.selling_price || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-4">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="row imageRow">
            <div className="col-6">
              <label>Featured Image:</label>
              <input
                type="file"
                onChange={handleFeaturedImageChange}
                accept="image/*"
              />
              <h5 className="mt-5">Current Featured Image</h5>
              <img
                src={`${formData.featuredImage.imageUrl}`}
                alt="FeaturedImage"
                className="w-25"
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
              <div>
                <h5 className="mt-5">Current Additional Images</h5>
                <span>
                  {formData.images?.map((image, idx) => (
                    <div key={idx} className="image-wrapper">
                      <img
                        src={`${image.imageUrl}`}
                        alt={`Additional ${idx}`}
                        style={{ width: "100px" }}
                        className="mx-2"
                      />

                      <button
                        type="button"
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() =>
                          handleDeleteImage(image, image.photoPublicId)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div>
            <label>Categories:</label>
            <div>
              {categories.map((category) => (
                <div key={category._id}>
                  <input
                    type="checkbox"
                    value={category._id}
                    checked={formData.categories.includes(category._id)}
                    onChange={handleCategoryChange}
                  />
                  <label>{category.name}</label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="mt-3 btn btn-outline-danger">
            Update Product
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateProduct;
