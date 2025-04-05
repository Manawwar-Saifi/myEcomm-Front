import React from "react";
import { NavLink } from "react-router-dom";
import map from "../../public/map.webp";
import { ToastContainer } from "react-toastify";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-4 col-md-6 col-sm-12">
              {/* <img src="" alt="Logo " /> */}
              <span>MANAWWAR</span>
              <p className="w-75">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam
                tenetur laudantium temporibus necessitatibus aliquam non soluta?
                Exercitationem officia labore blanditiis!
              </p>
            </div>
            <div className="col-lg-2 col-xl-2 col-md-6 col-sm-12">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/">About</NavLink>
                </li>
                <li>
                  <NavLink to="/">Services</NavLink>
                </li>
                <li>
                  <NavLink to="/">Project</NavLink>
                </li>
                <li>
                  <NavLink to="/">Products</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-xl-3 col-md-6 col-sm-12">
              <h4>Import Links</h4>
              <ul>
                <li>
                  <NavLink to="/">Privacy Policy</NavLink>
                </li>
                <li>
                  <NavLink to="/">Return & Refund</NavLink>
                </li>
                <li>
                  <NavLink to="/">Testing@gmail.com</NavLink>
                </li>
                <li>
                  <NavLink to="/">0123456789</NavLink>
                </li>
                <li>
                  <NavLink to="/">Address</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-xl-3 col-md-6 col-sm-12">
              <h4>Import Links</h4>
              <img src={map} alt="" />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Footer;
