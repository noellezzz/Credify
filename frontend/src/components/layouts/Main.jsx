import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <div className="font-poppins fixed top-0 left-0 h-auto w-full flex items-center justify-center header-shadow">
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
