import React from 'react'
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom"


import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx"
import UserProvider from './context/userContext.jsx';
import { UserContext } from './context/userContext.jsx';
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from 'react';


const App = () => {
  return (
     <UserProvider>
    <div>     
<Router>
<Routes>
<Route path="/" element={<Login />} />  {/*isko hta dena baad me */}
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<SignUp />} />

{/* Admin Routes */}
<Route element={<PrivateRoute allowedRoles={ ["admin"]} />}>

<Route path="/admin/dashboard" element={<Dashboard />} />
<Route path="/admin/tasks" element={<ManageTasks />} />
<Route path="/admin/create-task" element={<CreateTask />} /> 
<Route path="/admin/users" element={<ManageUsers />} /> 

</Route>

{/* User Routes neechy */} {/* i think user ayega check*/} 
<Route element={<PrivateRoute allowedRoles={["user"]} />}> 

<Route path="/user/dashboard" element={<UserDashboard/>} /> 
<Route path="/user/tasks" element={<MyTasks />} />
<Route path="/user/task-details/:id" element={<ViewTaskDetails />} />

{/* Default Route */}
<Route path="/" elelment={<Root/>}/>

</Route>

</Routes>
         </Router>
    </div>
     </UserProvider>
  )
}

export default App


const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />;
};



