import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const Sidebar = () => {
  return (
    <div className="side-bar">
      <div className="side-bar-div">
        <i className="fa-solid fa-xmark cross-Btn"></i>
        <ul>
          <h2>Manawwar Saifi</h2>
          <li>
            <NavLink to="/admin">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/admin/product">Product</NavLink>
          </li>
          <li>
            <NavLink to="/admin/category">Category</NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">Users</NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders">Order</NavLink>
          </li>
          <li>
            <NavLink to="/admin/transcation">Transactions</NavLink>
          </li>
          <li>
            <NavLink to="/admin/history">History</NavLink>
          </li>
          <li>
            <NavLink to="/admin/form">Form</NavLink>
          </li>
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
