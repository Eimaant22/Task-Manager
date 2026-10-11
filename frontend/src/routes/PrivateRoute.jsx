 import React, { useContext } from "react";
 import { Navigate, Outlet } from "react-router-dom";
 import { UserContext } from "../context/UserContext";

 const PrivateRoute = ({ allowedRoles }) => {
   const { user, loading } = useContext(UserContext);

   if (loading) return null;
   if (!user) return <Navigate to="/login" replace />;
   if (!allowedRoles.includes(user.role)) {
     return (
       <Navigate
         to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
         replace
       />
     );
   }

   return <Outlet />;
 };

 export default PrivateRoute;