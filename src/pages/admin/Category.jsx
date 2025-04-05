import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { errorMessage, successMessaage } from "../../Utils/Toastify";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { ToastContainer } from "react-toastify";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${backend_url}/category/all`);
        const result = await response.json();
        if (response.ok) {
          const rows = result.categories.map((category, index) => ({
            id: category._id, // Use category ID as unique identifiers
            name: category.name,
            description: category.description,
            photo: category.photo,
            index: `0${index + 1}`,
          }));
          setCategories(rows);
          // successMessaage(result.message);
        } else {
          errorMessage("Failed to fetch categories");
        }
      } catch (error) {
        errorMessage(`Error fetching categories: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/update-category/${id}`); // Navigate to the Edit Category page
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`${backend_url}/category/delete/${id}`, {
          method: "DELETE",
        });
        const result = await response.json();

        if (response.ok) {
          successMessaage("Category deleted successfully");
          setCategories((prev) =>
            prev.filter((category) => category.id !== id)
          );
        } else {
          errorMessage("Failed to delete category");
        }
      } catch (error) {
        errorMessage(`Error deleting category: ${error.message}`);
      }
    }
  };

  const columns = [
    { field: "index", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "photo",
      headerName: "Photo",
      width: 130,
      renderCell: (params) => (
        <img
          src={`${params.value}`}
          alt="Category"
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
            onClick={() => handleEdit(params.row.id)}
            style={{ marginRight: "10px" }}
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
    return <p>Loading categories...</p>;
  }

  return (
    <div className="admin-product">
      <div className="categoryHead">
        <h2>Category</h2>
        <NavLink to="/admin/add-category" className="btn btn-outline-primary">
          <i className="fa-solid fa-plus"></i> Add Category
        </NavLink>
      </div>

      <div>
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={categories} // Pass categories as rows to DataGrid
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

export default Category;
