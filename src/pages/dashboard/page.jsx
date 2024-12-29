import React, { useContext, useEffect, useState } from "react";
import Card from "./components/Card/Card";
import CardSkeleton from "./components/Card/CardSkeleton"; // Import the CardSkeleton component
import Table from "./components/Table/Table";
import ContractTable from "./components/Contracts Table/Contracts";
import { UserContext } from "../../context/UserContext";
import { getAllDrivers, getCpDrivers, getCps } from "../../lib/utils";

const Dashboard = () => {
  const { user } = useContext(UserContext); // Get user context
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalAmount: 0,
    totalTrips: 0,
    totalDrivers: 0,
    totalControlPanels: 0,
    updateTotalTrips: 0,
    updateContracts: 0,
    updateControlPanels: 0,
  });

  const parseDate = (dateStr) => {
    if (typeof dateStr === "string") {
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const calculateMetrics = async () => {
    const today = new Date();
    const thirtyDaysBack = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 30
    );
    const yesterdayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );

    let tempContracts = 0;
    let tempTrips = 0;
    let tempDrivers = 0;
    user?.contracts?.forEach((contract) => {
      const createAt = new Date(contract.createdAt);
      if (createAt >= thirtyDaysBack) {
        tempContracts++;
      }
    });

    const drivers = await getCpDrivers(user._id);
    drivers?.forEach((driver) => {
      driver.tripDetails.forEach((trip) => {
        const tripDate = parseDate(trip.tripDate);
        if (tripDate >= yesterdayStart && tripDate <= today) {
          tempTrips++;
        }
      });

      const joinDate = new Date(driver.dateOfJoining);
      if (joinDate >= thirtyDaysBack) {
        tempDrivers++;
      }
    });

    const totalDriversTrips = drivers?.reduce(
      (acc, driver) => acc + driver.tripDetails.length,
      0
    );
    const totalAmountTransferred = user?.reports?.reduce(
      (acc, report) => (report.status === "Done" ? acc + report.amount : acc),
      0
    );

    setDashboardMetrics((prev) => ({
      ...prev,
      totalAmount: totalAmountTransferred,
      totalTrips: totalDriversTrips,
      totalDrivers: tempDrivers,
      updateTotalTrips: tempTrips,
      updateContracts: tempContracts,
    }));
  };

  const calculateAdminMetrics = async () => {
    const today = new Date();
    const thirtyDaysBack = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 30
    );

    const drivers = await getAllDrivers().catch((err) => {
      console.error("Error fetching drivers:", err);
      return [];
    });

    let tempDrivers = 0;
    let tempControlPanels = 0;
    let tempContracts = 0;

    drivers.forEach((driver) => {
      const joinDate = new Date(driver.dateOfJoining);
      if (joinDate >= thirtyDaysBack) {
        tempDrivers++;
      }
    });

    const controlPanels = await getCps();
    controlPanels?.forEach((controlPanel) => {
      const createdAt = new Date(controlPanel.dateOfJoining);
      if (createdAt >= thirtyDaysBack) {
        tempControlPanels++;
      }
    });

    user?.contracts?.forEach((contract) => {
      const createAt = new Date(contract.createdAt);
      if (createAt >= thirtyDaysBack) {
        tempContracts++;
      }
    });

    setDashboardMetrics((prev) => ({
      ...prev,
      totalDrivers: tempDrivers,
      updateContracts: tempContracts,
      updateControlPanels: tempControlPanels,
    }));
    setDrivers(drivers);
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      setIsAdmin(user.isAdmin);
      if (user.isAdmin) {
        await calculateAdminMetrics();
      } else {
        await calculateMetrics();
      }
      setLoading(false);
    };

    fetchMetrics();
  }, [user]);

  return (
    <div className="flex flex-col gap-7 p-6">
      <div className="flex items-center justify-around">
        {loading ? (
          <>
            <CardSkeleton width={"33%"} />
            <CardSkeleton width={"33%"} />
            <CardSkeleton width={"33%"} />
          </>
        ) : (
          <>
            <Card
              title={"Total Drivers"}
              value={isAdmin ? drivers.length : user?.drivers?.length || 0}
              update={`+${dashboardMetrics.totalDrivers}`}
              width={"33%"}
            />
            {isAdmin ? (
              <Card
                title={"Total Control Panels"}
                value={user?.controlPanels?.length || 0}
                update={`+${dashboardMetrics.updateControlPanels}`}
                width={"33%"}
              />
            ) : (
              <Card
                title={"Total Trips"}
                value={dashboardMetrics.totalTrips}
                update={`+${dashboardMetrics.updateTotalTrips}`}
                width={"33%"}
                msg={`Trips today`}
              />
            )}
            <Card
              title={"Total Contracts"}
              value={user?.contracts.length || 0}
              update={`+${dashboardMetrics.updateContracts}`}
              width={"33%"}
            />
          </>
        )}
      </div>
      <div className="flex gap-2">
        <>
          <Table />
          {user && (
            <div className="flex flex-col gap-2 w-[33%]">
              <ContractTable />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Dashboard;
