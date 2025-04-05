import React from "react";

const ShowSidebar = () => {
  const [show, setShow] = useState(false);
  return {
    show,
    setShow,
  };
};

export default ShowSidebar;
