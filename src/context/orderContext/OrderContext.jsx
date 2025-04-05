import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(null);

  const createOrder = async (orderData) => {
    try {
      const response = await fetch("http://localhost:8000/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      setOrder(data);
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const updatePaymentStatus = async (orderId, status) => {
    try {
      await fetch("http://localhost:8000/orders/update-payment-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ order, createOrder, updatePaymentStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
