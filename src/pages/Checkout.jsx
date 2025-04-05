import React, { useEffect, useState } from "react";
import { errorMessage, successMessaage } from ".././Utils/Toastify";
import { ToastContainer } from "react-toastify";
const Checkout = () => {
  const [mycart, setMyCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [productDetails, setProductDetails] = useState([]);
  const [cartTotal, setCartTotal] = useState({
    subTotal: 0,
    totalItems: 0,
    grandTotal: 0,
  });

  const backend_url = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return console.error("User ID not found in localStorage");

      try {
        const response = await fetch(
          `${backend_url}/cart/all?userId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch cart");

        const result = await response.json();
        setMyCart(result.cart.items || []);
      } catch (error) {
        console.error(`Error fetching cart: ${error.message}`);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    let totalQuantity = 0;
    const subTotal = mycart.reduce((acc, item) => {
      totalQuantity += item.quantity;
      return acc + item.price * item.quantity;
    }, 0);

    setCartTotal({
      totalItems: totalQuantity,
      subTotal,
      grandTotal: subTotal, // Modify if tax/shipping needs to be added
    });
  }, [mycart]);

  useEffect(() => {
    const updatedDetails = mycart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.price,
    }));
    setProductDetails(updatedDetails);
  }, [mycart]);

  // useEffect(() => {
  //   console.log("Product Details Updated:", productDetails);
  // }, [productDetails]);

  const handleOnlinePayment = async () => {
    try {
      const keyRes = await fetch(`${backend_url}/key`);
      if (!keyRes.ok) throw new Error("Failed to fetch payment key");

      const { key } = await keyRes.json();

      // Ensure `products` array is correctly formatted
      const formattedProducts = mycart.map((item) => ({
        productId: item.productId._id, // Ensure _id exists
        quantity: item.quantity,
        price: item.price,
      }));

      // Debugging: Log request payload before sending it
      console.log("Sending Order Data:", {
        amount: cartTotal.subTotal,
        products: formattedProducts,
        userId: localStorage.getItem("userId"),
        paymentMethod: "Online",
      });

      const response = await fetch(`${backend_url}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal.subTotal,
          products: formattedProducts,
          userId: localStorage.getItem("userId"),
          paymentMethod: "Online",
          totalPrice: cartTotal.subTotal,
        }),
      });

      const data = await response.json();
      console.log("Payment API Response:", data);

      if (!response.ok)
        throw new Error(data.message || "Failed to initiate payment");

      const { razorpayOrder } = data;

      const userName = localStorage.getItem("name") || "Customer";
      const userPhoto = localStorage.getItem("photo") || "default.png";
      const userEmail = localStorage.getItem("email") || "customer@example.com";

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: userName,
        description: "Payment for order",
        image: `${backend_url}/uploads/${userPhoto}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          const verifyRes = await fetch(
            `${backend_url}/orders/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: razorpayOrder.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: localStorage.getItem("userId"),
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            alert("Payment successful! Your order has been placed.");
          } else {
            alert(`Payment verification failed: ${verifyData.message}`);
          }
        },
        prefill: { name: userName, email: userEmail, contact: "0123456789" },
        theme: { color: "red" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error in online payment:", error.message);
      alert(`Payment error: ${error.message}`);
    }
  };

  const handleCODPayment = async () => {
    try {
      const response = await fetch(`${backend_url}/orders/create/cod`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPrice: cartTotal.subTotal,
          paymentMethod: "COD",
          userId: localStorage.getItem("userId"),
          products: productDetails,
          amount: cartTotal.subTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorMessage(data.message);
      }
      successMessaage(data.message);
    } catch (error) {
      console.error("Error placing COD order:", error.message);
      alert(`Order failed: ${error.message}`);
    }
  };

  return (
    <div className="cartPage">
      <div className="container-fluid">
        <div className="row justify-content-center">
          {mycart.length > 0 && (
            <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 righ-side">
              <div className="sticky">
                <div className="coupon-code">
                  <h5>Coupon Code</h5>
                  <form>
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
                      <span>Sub-Total:</span>{" "}
                      <span>&#8377;{cartTotal.subTotal}</span>
                    </h6>
                    <h6>
                      <span>Items:</span> <span>({cartTotal.totalItems})</span>
                    </h6>
                    <h6>
                      <span>Tax:</span> <span>&#8377;0.00</span>
                    </h6>
                    <h6>
                      <span>Coupon Code:</span> <span>&#8377;0.00</span>
                    </h6>
                    <h3>
                      <span>Grand Total:</span>{" "}
                      <span>&#8377;{cartTotal.subTotal}</span>
                    </h3>

                    <div className="payment-method">
                      <h5>Select Payment Method</h5>
                      <label>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />{" "}
                        Cash on Delivery (COD)
                      </label>
                      <br />
                      <label>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Online"
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />{" "}
                        Online Payment
                      </label>
                    </div>

                    {paymentMethod === "Online" && (
                      <button
                        className="btn btn-warning w-100 mt-2 checkout-btn"
                        onClick={handleOnlinePayment}
                      >
                        Pay Now
                      </button>
                    )}
                    {paymentMethod === "COD" && (
                      <button
                        className="btn btn-warning w-100 mt-2 checkout-btn"
                        onClick={handleCODPayment}
                      >
                        Confirm Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {mycart.length === 0 && <p>Your cart is empty.</p>}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Checkout;
