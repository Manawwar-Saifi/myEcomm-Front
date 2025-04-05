import React, { useState } from "react";

const TogglePasswordType = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };
  return { handleTogglePassword, showPassword };
};

export default TogglePasswordType;
