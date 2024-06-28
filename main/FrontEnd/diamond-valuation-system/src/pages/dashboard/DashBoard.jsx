import React, { useContext } from "react";
import { UserContext } from "../../components/GlobalContext/AuthContext";
import AdminPage from "../admin/AdminPage";
import ValuationStaffDashboard from "./valuation/ValuationStaffDashBoard";
import ConsultingStaffDashboard from "./consulting/ConsultingStaffDashboard";
import CustomerDashboard from "./customer/CustomerDashboard";
import ManagerDashboard from "./manager/ManagerDashboard";

export default function DashBoard() {
  const user = useContext(UserContext);
  return (
    <>
      {(user.userAuth.roleid === 1 && <AdminPage />) ||
        (user.userAuth.roleid === 2 &&<ManagerDashboard/>) ||
        (user.userAuth.roleid === 3 && <ConsultingStaffDashboard />) ||
        (user.userAuth.roleid === 4 && <ValuationStaffDashboard />) ||
        (user.userAuth.roleid === 5 && <CustomerDashboard />)}
    </>
  );
}
