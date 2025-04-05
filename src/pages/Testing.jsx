import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { errorMessage, successMessaage } from "../Utils/Toastify";

const Cart = () => {
  const navigate = useNavigate();

  if (!localStorage.userId) {
    navigate("/login");
  }

  const [mycart, setMyCart] = useState([]);
  const [cartTotal, setCartTotal] = useState({
    subTotal: 0,
    totalItems: 0,
    grandTotal: 0,
  });
  const backend_url = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const AllURL = `${backend_url}/cart/all?userId=${localStorage.userId}`;
    const allCart = async () => {
      try {
        const response = await fetch(AllURL);
        const result = await response.json();
        setMyCart(result.cart.items);
      } catch (error) {
        errorMessage(`Something went wrong::${error.message}`);
      }
    };

    allCart();
  }, [mycart]);

  useEffect(() => {
    let totalQuantity = 0;
    const subTotal = mycart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    mycart.map((item) => {
      totalQuantity = totalQuantity + item.quantity;
    });

    setCartTotal({
      totalItems: totalQuantity,
      subTotal: subTotal,
    });
  }, [mycart]);

  const handleDelete = async (productId) => {
    const userId = localStorage.getItem("userId"); // Get userId from localStorage
    if (!userId) {
      errorMessage("User not logged in");
      return;
    }

    try {
      const response = await fetch(`${backend_url}/cart/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      });

      const result = await response.json();
      if (response.ok) {
        successMessaage(result.message || "Item removed successfully");

        // Update the cart state after deletion
        setMyCart((prevCart) =>
          prevCart.filter((item) => item._id !== productId)
        );
      } else {
        errorMessage(result.message || "Failed to remove item");
      }
    } catch (error) {
      errorMessage(`Error: ${error.message}`);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      errorMessage("User not logged in");
      return;
    }

    // Optimistically update UI
    setMyCart((prevCart) =>
      prevCart.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // If quantity is less than 1, call delete API
    if (newQuantity < 1) {
      handleDelete(productId);
      return;
    }

    try {
      const response = await fetch(`${backend_url}/cart/update`, {
        method: "PUT", // Adjust based on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId, quantity: newQuantity }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update quantity");
      }
      successMessaage(result.message || "Quantity updated successfully");
    } catch (error) {
      errorMessage(`Error: ${error.message}`);

      // Revert state if API fails
      setMyCart((prevCart) =>
        prevCart.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: newQuantity - 1 }
            : item
        )
      );
    }
  };

  return (
    <div className="cartPage">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-9 col-lg-9 col-md-5 col-sm-12 left-side">
            <div className="main">
              {mycart.length > 0 ? (
                <>
                  <div className="row header-row text-center">
                    <div className="col-2 text-start">
                      <span>S.No.</span>
                    </div>
                    <div className="col-2 text-start">
                      <span>Product</span>
                    </div>
                    <div className="col-2">
                      <span>Price</span>
                    </div>
                    <div className="col-2">
                      <span>Quantity</span>
                    </div>
                    <div className="col-2">
                      <span>Total</span>
                    </div>
                    <div className="col-2">
                      <span>Action</span>
                    </div>
                  </div>

                  {mycart.map((item, index) => (
                    <div className="row product-row text-center" key={index}>
                      <div className="col-4 one">
                        <div className="row">
                          <div className="col-5 d-flex align-items-start justify-content-start">
                            <img
                              src={`${backend_url}/uploads/${item.image}`}
                              alt=""
                            />
                          </div>
                          <div className="col-7 text-start justify-content-center align-items-center d-flex ">
                            <h6>{item.name}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-2 two">
                        <span>&#8377;{item.price}</span>
                      </div>
                      <div className="col-2 three">
                        <div className="d-flex">
                          <span
                            className="btn btn-light"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId._id,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </span>
                          <input
                            type="number"
                            value={item.quantity}
                            disabled
                            className="w-25 text-center"
                          />
                          <span
                            className="btn btn-light"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId._id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </span>
                        </div>
                      </div>
                      <div className="col-2 four">
                        <span>&#8377;{item.quantity * item.price}</span>
                      </div>
                      <div className="col-2 four">
                        <button
                          className="buttonDeleteCart btn btn-danger"
                          onClick={() => handleDelete(item.productId._id)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center my-5">
                  <h4>Your cart is empty now!</h4>
                  <p>Start adding items to your cart.</p>
                  <NavLink to="/shop" className="btn btn-primary">
                    Go to Shop
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {mycart.length > 0 && (
            <div className="col-xl-3 col-lg-3 col-md-7 col-sm-12 right-side ">
              <div className="sticky">
                <div className="coupon-code">
                  <h5>Coupon Code</h5>
                  <form action="">
                    <input type="text" placeholder="Coupon Code" />
                    <button
                      type="submit"
                      className="btn btn-outline-danger w-100 sm py-1"
                    >
                      Apply
                    </button>
                  </form>
                </div>
                <div className="total-cart">
                  <h5>Cart Total</h5>
                  <div className="details">
                    <h6>
                      <span>Sub-Total:</span>
                      <span>&#8377;{cartTotal.subTotal}</span>
                    </h6>
                    <h6>
                      <span>Items:</span>
                      <span>({cartTotal.totalItems})</span>
                    </h6>
                    <h6>
                      <span>Tax:</span>
                      <span>&#8377;0.00</span>
                    </h6>
                    <h6>
                      <span>Coupon Code:</span>
                      <span>&#8377;0.00</span>
                    </h6>
                    <h3>
                      <span>Grand Total:</span>
                      <span>&#8377;{cartTotal.subTotal} for now</span>
                    </h3>
                    <NavLink
                      to="/checkout"
                      className="btn text-danger bg-white sm w-100 mt-2 checkout-btn"
                    >
                      Proceed To Checkout
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
