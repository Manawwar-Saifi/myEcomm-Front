import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const backend_url = import.meta.env.VITE_BASE_API_URL;
  const userId = localStorage.getItem("userId");
  const apiUrl = `${backend_url}/user/single-user/${userId}`;
  const ordersApiUrl = `${backend_url}/orders/single-order/${userId}`;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        setUserData(result.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [apiUrl]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch(ordersApiUrl);
        const result = await response.json();
        console.log(result[0], "::reutl");
        if (Array.isArray(result) && result.length > 0) {
          const allProducts = result.flatMap((order) =>
            order.products.map((product) => ({
              orderId: order._id,
              productName: product.productId.name,
              price: product.price,
              quantity: product.quantity,
              totalPrice: order.totalPrice,
              paymentStatus: order.paymentStatus,
              orderStatus: order.orderStatus,
              paymentMethod: order.paymentMethod,
              createdAt: order.createdAt,
            }))
          );

          setOrders(allProducts);
        } else {
          console.error("No orders found.");
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    fetchUserOrders();
  }, [ordersApiUrl]);

  // ✅ Calculate Total Price Correctly
  useEffect(() => {
    const totalAmount = orders.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotal(totalAmount);
  }, [orders]);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4 left text-center">
            <div className="innerDiv text-center d-flex flex-column align-items-center">
              <div className="imgDiv">
                <img
                  src={`${userData.photo}`}
                  className="w-50 border my-3"
                  alt="User Image"
                />
              </div>
              <h4>{userData.name}</h4>
              <h5>{userData.email}</h5>
              <h6>{userData.phone}</h6>
              <div className="d-flex gap-2">
                <p>{userData.city}</p>
                <p>{userData.state}</p>
                <p>{userData.country}</p>
                <p>{userData.address}</p>
                <p>{userData.pincode}</p>
              </div>
              <NavLink
                to="/profile-update"
                className="btn btn-outline-danger btn-sm rounded-5 px-5 d-block w-75 mt-3 mb-5"
              >
                Update Profile
              </NavLink>
            </div>
          </div>
          <div className="col-md-7 right">
            <Tabs
              defaultActiveKey="order"
              id="justify-tab-example"
              className="mb-3"
              justify
            >
              <Tab eventKey="order" title="Order-Details" className="firstTab">
                {orders.length > 0 ? (
                  <>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Product Name</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total Price</th>
                          <th>Payment Status</th>
                          <th>Order Status</th>
                          <th>Order paymentMethod</th>
                          <th>Order Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((product, index) => (
                          <tr key={index}>
                            <td>{product.orderId}</td>
                            <td>{product.productName}</td>
                            <td> ₹{product.price}</td>
                            <td>{product.quantity}</td>
                            <td> ₹{product.price * product.quantity}</td>
                            <td>{product.paymentStatus}</td>
                            <td>{product.orderStatus}</td>
                            <td>{product.paymentMethod}</td>
                            <td>
                              {new Date(product.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <h5 className="mt-3">Total Amount: ₹{total}</h5>
                  </>
                ) : (
                  <p>No orders found.</p>
                )}
              </Tab>

              <Tab eventKey="home" title="Home" className="secondTab">
                Tab content for Home
              </Tab>
              <Tab
                eventKey="longer-tab"
                title="Loooonger Tab"
                className="thirdTab"
              >
                Tab content for Loooonger Tab
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
