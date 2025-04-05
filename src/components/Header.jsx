import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import LoginContext from "../context/userContext/userContext";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { loggedIn, setLoggedIn, userData } = useContext(LoginContext);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("photo");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  const show = () => {
    setIsVisible(true);
  };
  const hide = () => {
    setIsVisible(false);
  };

  return (
    <div className="header">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-2 mainLogo">
            <NavLink to="">
              <h4>Manawwar</h4>
            </NavLink>
          </div>
          <div
            className={`col-lg-10 hiddenInPhone ${
              isVisible ? "" : "hideClick"
            }`}
          >
            <i className="fa-solid fa-xmark closeMenu" onClick={hide}></i>
            <ul className="d-flex">
              <li>
                <NavLink
                  to=""
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-danger px-4 py-1 rounded"
                      : "text-dark"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className={loggedIn ? "d-none" : "d-block"}>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-danger px-4 py-1 rounded"
                      : "text-dark"
                  }
                >
                  Login
                </NavLink>
              </li>
              <li className={loggedIn ? "d-none" : "d-block"}>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-danger px-4 py-1 rounded"
                      : "text-dark"
                  }
                >
                  Signup
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-danger px-4 py-1 rounded"
                      : "text-dark"
                  }
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/form"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-danger px-4 py-1 rounded"
                      : "text-dark"
                  }
                >
                  Form
                </NavLink>
              </li>
              <li className={loggedIn ? "d-block" : "d-none"}>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-danger px-4 py-1 rounded"
                      : "text-dark"
                  }
                >
                  Cart
                </NavLink>
              </li>
              {/* <li className={loggedIn ? "d-block" : "d-none"}>
                <NavLink
                  to="/checkout"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-danger px-4 py-1 rounded"
                      : "text-dark"
                  }
                >
                  Checkout
                </NavLink>
              </li> */}
              <li className={loggedIn ? "d-block" : "d-none"}>
                <button
                  className="text-uppercase px-3 py-1 btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
              <li
                className={
                  loggedIn ? "d-flex gap-2 align-items-center" : "d-none"
                }
              >
                <h4>{userData.name}</h4>
                <NavLink to="/profile">
                  <img
                    src={`${userData.photo}`}
                    alt="User"
                    className={`${userData.name}`}
                    width={40}
                  />
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="phoneMenu">
            <i className="fa-solid fa-bars" onClick={show}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
