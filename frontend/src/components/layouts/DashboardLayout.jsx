import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar always visible */}
      <Navbar activeMenu={activeMenu} />

      {/* Show SideMenu and content only if user exists */}
      {user && (
        <div className="flex">
          {/* Side menu visible only on large screens */}
          <div className="hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main page content */}
          <div className="flex-grow mx-5 mt-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
