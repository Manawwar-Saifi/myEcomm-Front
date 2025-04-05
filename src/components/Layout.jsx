import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

import React from "react";
import Sidebar from "./Sidebar";

export const AdminLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar className="side-bar" />
      <main>
        <div className="bg-white admin-header">
          <div className="d-flex w-100">
            <p className="">Report & Analysis</p>
            <div className="d-flex justify-content-evenly align-items-center icon-div">
              <i className="fa-solid fa-bell"></i>
              <img
                src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1731584119~exp=1731587719~hmac=3ee85a89bdfb842baac402ebea0d70c384b0d26ac94534ecd90286fa303dbcdd&w=740"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="change">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
