import { toast } from "react-toastify";

export const successMessaage = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 1000,
  });
};

export const errorMessage = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 1000,
  });
};
