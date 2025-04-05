import React, { useState, useEffect } from "react";
import { errorMessage, successMessaage } from "../../Utils/Toastify";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const api = `${backend_url}/form/get`;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await fetch(api);
        const result = await response.json();
        if (response.ok) {
          const rows = result.users.map((user, index) => ({
            id: `${index + 1}`, // Ensure MongoDB _id is mapped correctly
            name: user.name,
            email: user.email,
            message: user.message,
          }));
          setFormData(rows);
          console.log("Data fetched successfully!");
        } else {
          errorMessage("Failed to fetch data");
        }
      } catch (error) {
        errorMessage(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "message", headerName: "Message", width: 300 },
  ];

  return (
    <div className="admin-form">
      <div className="admin-product">
        <div className="categoryHead">
          <h2>Forms</h2>
        </div>

        <Paper sx={{ height: 400, width: "100%" }}>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <DataGrid
              rows={formData}
              columns={columns}
              pageSize={5}
              pageSizeOptions={[5, 10, 15]} // Correct prop for page size options
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 }, // Default page size
                },
              }}
              checkboxSelection={false}
              sx={{ border: 0 }}
            />
          )}
        </Paper>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Form;
