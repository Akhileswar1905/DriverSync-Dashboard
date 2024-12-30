import { MdDashboard, MdDirectionsCarFilled } from "react-icons/md";
import { FaFileContract, FaMoneyBillAlt } from "react-icons/fa";
import { IoIosNotifications, IoIosPeople } from "react-icons/io";
import { HiPencilAlt } from "react-icons/hi";

import Dashboard from "../../../pages/dashboard/page";
import Contracts from "../../../pages/contracts/page";
import Drivers from "../../../pages/drivers/page";
import NewDrivers from "../../../pages/new-drivers/page";
import Reports from "../../../pages/reports/page";
import UpdateRequests from "../../../pages/update-requests/page";
import ControlPanel from "../../../pages/control-panels/page";

// Check isAdmin from local storage
const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
console.log(typeof isAdmin);

export const links = [
  {
    name: "Dashboard",
    path: "/",
    icon: MdDashboard,
    requests: 0,
    component: Dashboard,
    showForAdmin: true, // Only show for admin
  },
  {
    name: "Drivers",
    path: "/drivers",
    icon: MdDirectionsCarFilled,
    requests: 0,
    component: Drivers,
    detailsPath: "/drivers/:id",
    showForAdmin: true, // Only show for admin
  },
  {
    name: "Control Panels",
    path: "/control-panels",
    icon: IoIosPeople,
    requests: 0,
    component: ControlPanel,
    detailsPath: "/control-panels/:id",
    onlyAdmin: true,
  },
  {
    name: "Contracts",
    path: "/contracts",
    icon: FaFileContract,
    requests: 0,
    component: Contracts,
    detailsPath: "/contracts/:id",
    showForAdmin: true, // Only show for admin
  },
  {
    name: "New Drivers Requests",
    path: "/new-driver",
    icon: IoIosNotifications,
    requests: 0,
    component: NewDrivers,
    detailsPath: "/new-driver/:id",
    showForAdmin: false, // Show for all
  },
  {
    name: "Trip Update Requests",
    path: "/trip-update",
    icon: HiPencilAlt,
    requests: 0,
    component: UpdateRequests,
    detailsPath: "/trip-update/:id",
    showForAdmin: false, // Show for all
  },
  {
    name: "Transaction Reports",
    path: "/transaction-reports",
    icon: FaMoneyBillAlt,
    requests: 0,
    component: Reports,
    detailsPath: "/transaction-reports/:id",
    showForAdmin: true, // Show for all
  },
];

// Filter the links based on isAdmin
export const filteredLinks = links.filter((link) => {
  if (link.showForAdmin) {
    return isAdmin; // Show only if isAdmin is true
  }
  return true; // Show for all users
});
