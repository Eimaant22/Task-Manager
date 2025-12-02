import React, { useState, useContext, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth.jsx";
import { UserContext } from "../../context/userContext.jsx";
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.jsx"; // adjust path if needed
import moment from "moment"
import { API_PATHS } from "../../utils/apiPaths.jsx";
import InfoCard from "../../components/Cards/InfoCard.jsx";
import CustomBarChart from "../../components/Charts/CustomBarChart.jsx";
import CustomPieChart from "../../components/Charts/CustomPieChart.jsx";
import { IoMdCard} from "react-icons/io";
import { ArrowRight } from "lucide-react";
import TaskListTable from "../../components/TaskListTable.jsx";

import { addThousandsSeparator } from "../../utils/helper.js";
const UserDashboard = () => {
  const COLORS = ["#00BC7D", "#FE9900", "#FF1F57"];

  useUserAuth(); //hook (remmeber the one to redirect to login page if user doest logged in)
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  //*** Prepare Chart Data ***
const prepareChartData = (data) => {
  const taskDistribution = data?.taskDistribution || null;
  const taskPriorityLevels = data?.taskPriorityLevels || null;

  // Task distribution for Pie chart
  const taskDistributionData = [
    { status: "Pending", count: taskDistribution?.Pending || 0 },
    { status: "In Progress", count: taskDistribution?.InProgress || 0 },
    { status: "Completed", count: taskDistribution?.Completed || 0 },
  ];
  setPieChartData(taskDistributionData);

  // Task priority levels for Bar chart
  const priorityLevelData = [
    { priority: "Low", count: taskPriorityLevels?.Low || 0 },
    { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
    { priority: "High", count: taskPriorityLevels?.High || 0 },
  ];
  setBarChartData(priorityLevelData);
};


  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts);

    
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
     
    }
  };

  const onSeeMore=()=>{
    navigate("/admin/tasks")
  }

  useEffect(() => {
    getDashboardData();
    return()=>{}
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      
   {/* {JSON.stringify(dashboardData)}  To visualize data for better understanding during making this project */}
   <div className="card my-5">
<div>
<div className="col-span-3">
<h2 className="text-xl md:text-2x1">Good Morning! {user?.name}</h2> <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
{moment().format("dddd Do MMM YYYY")}
</p>
</div>
</div>
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">

  <InfoCard icon={<IoMdCard />} // Total tasks
   label="Total Tasks"
value={addThousandsSeparator(
  dashboardData?.charts?.taskDistribution?.ALL || 0
)}
color="bg-primary"/>

<InfoCard icon={<IoMdCard />} // Pending Tasks
   label="Pending Tasks"
value={addThousandsSeparator(
  dashboardData?.charts?.taskDistribution?.Pending || 0
)}
color="bg-violet-500"/>

<InfoCard icon={<IoMdCard />} // In Progress Tasks
   label="In Progress Tasks"
value={addThousandsSeparator(
  dashboardData?.charts?.taskDistribution?.InProgress || 0
)}
color="bg-cyan-500"/>

<InfoCard icon={<IoMdCard/>} // Completed Tasks
   label="Completed Tasks"
value={addThousandsSeparator(
  dashboardData?.charts?.taskDistribution?.Completed || 0
)}
color="bg-lime-500"/>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
  {/* piechart */}
  <div>
  <div className="card">
    <div className="flex items-center justify-between">
      <h5 className="font-medium">Task Distribution</h5>
    </div>
    <CustomPieChart
      data={pieChartData}
      colors={COLORS}
    />
 
  </div>
</div>

{/* BarChart */}
  <div>
  <div className="card">
    <div className="flex items-center justify-between">
      <h5 className="font-medium">Task Priority Levels</h5>
    </div>
    <CustomBarChart
      data={barChartData}
      colors={COLORS}
    />
    
 
  </div>
</div>
 
  <div className="md:col-span-2">
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Tasks</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <ArrowRight className="text-base" />
        </button>
      </div>
      <TaskListTable tableData={dashboardData?.recentTasks || []} />
    </div>
  </div>
</div>

    </DashboardLayout>
  );
};

export default UserDashboard;
