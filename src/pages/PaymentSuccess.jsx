import React from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  return (
    <div className="text-center text-white bg-danger my-5">
        PaymentSuccess and Order Confirmed Successfully 
        <h1>Reference No. {searchQuery.get("reference")}</h1>
    </div>
  );
};

export default PaymentSuccess;
