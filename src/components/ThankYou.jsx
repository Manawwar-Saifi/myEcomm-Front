import { useParams } from "react-router-dom";

const ThankYou = () => {
  const { orderId } = useParams();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Thank You for Your Order!</h1>
      <p>Your Order ID: <strong>{orderId}</strong></p>
      <p>We will process your order soon.</p>
    </div>
  );
};

export default ThankYou;
