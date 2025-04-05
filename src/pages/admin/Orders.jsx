import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Orders = () => {
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  const apiUrl = `${backend_url}/orders/get-all`;
  const updateStatusUrl = `${backend_url}/orders/update-status`;

  const [orders, setOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        setOrders(result.orders || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const flattenedProducts = orders.flatMap((order) =>
        order.products.map((product) => ({
          id: `${order._id}-${product.productId._id}`,
          orderId: order._id,
          userName: order.userId?.name || "N/A",
          email: order.userId?.email || "N/A",
          productName: product.productId?.name || "N/A",
          quantity: product.quantity,
          price: product.price,
          totalPrice: order.totalPrice,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          createdAt: new Date(order.createdAt).toLocaleString(),
          image: product.productId?.image || "default.jpg",
        }))
      );
      setAllProducts(flattenedProducts);
    }
  }, [orders]);

  const handleStatusChange = async (id, field, value) => {
    try {
      const response = await fetch(
        `${backend_url}/orders/update-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setAllProducts((prev) =>
          prev.map((item) =>
            item.orderId === id ? { ...item, [field]: value } : item
          )
        );
        toast.success("Status updated successfully");
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
      console.log(error.message);
    }
  };

  const columns = [
    { field: "orderId", headerName: "Order ID", width: 180 },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "productName", headerName: "Product Name", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "totalPrice", headerName: "Total Price", width: 120 },
    { field: "paymentMethod", headerName: "Payment Method", width: 150 },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) =>
            handleStatusChange(
              params.row.orderId,
              "paymentStatus",
              e.target.value
            )
          }
          size="small"
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
        </Select>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) =>
            handleStatusChange(
              params.row.orderId,
              "orderStatus",
              e.target.value
            )
          }
          size="small"
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Shipped">Shipped</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      ),
    },
    { field: "createdAt", headerName: "Order Date", width: 200 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={`${params.value}`}
          alt={`${params.value}`}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
  ];

  return (
    <div className="orders" style={{ padding: 20 }}>
      <h2>Orders Table</h2>
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={allProducts}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          sx={{ border: 0 }}
        />
      </Paper>
      <ToastContainer />
    </div>
  );
};

export default Orders;
