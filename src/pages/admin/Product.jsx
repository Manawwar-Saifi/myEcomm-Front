import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { errorMessage, successMessaage } from "../../Utils/Toastify";

const Product = () => {
  const [products, setProducts] = useState([]);
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const allProductApi = `${backend_url}/product/all`;

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const response = await fetch(allProductApi);
        const result = await response.json();

        const row = result.products.map((product, index) => ({
          id: product._id, // Use category ID as unique identifiers
          name: product.name,
          description: product.description,
          featuredImage: product.featuredImage.imageUrl,
          index: `0${index + 1}`,
          sku: product.sku,
        }));

        setProducts(row);
      } catch (err) {
        errorMessage(`All Product Fetching Error::${err}`);
      }
    };

    fetchAllProduct();
  }, []);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/product-detail/${id}`); // Navigate to the Edit Category page
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(
          `${backend_url}/product/delete/${id}`,
          {
            method: "DELETE",
          }
        );
        const result = await response.json();

        if (response.ok) {
          successMessaage("Category deleted successfully");
          setTimeout(() => {
            navigate("/admin/product");
          }, 2000);
        } else {
          errorMessage("Failed to delete category");
        }
      } catch (error) {
        errorMessage(`Error deleting category: ${error.message}`);
      }
    }
  };

  const [loading, setLoading] = useState(false);
  const columns = [
    { field: "index", headerName: "ID", width: 100 },
    { field: "sku", headerName: "SKU", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "featuredImage",
      headerName: "featuredImage",
      width: 130,
      renderCell: (params) => (
        <img
          src={`${params.value}`}
          alt="Product"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginRight: "10px" }}
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading Product...</p>;
  }

  return (
    <div className="admin-product">
      <div className="categoryHead">
        <h2>Products</h2>
        <NavLink to="/admin/add-product" className="btn btn-outline-primary">
          <i className="fa-solid fa-plus"></i> Add Product
        </NavLink>
      </div>

      <div>
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={2}
            rowsPerPageOptions={[2]}
            checkboxSelection={false}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Product;
