import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCp } from "../../../lib/utils";
import { UserContext } from "../../../context/UserContext";

const ReviewedReport = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [cp, setCp] = useState({});
  const { user } = useContext(UserContext);
  const { report } = location.state;

  useEffect(() => {
    const getCP = async () => {
      if (user.isAdmin) {
        const cp = await getCp(report.cpId);
        setCp(cp);
      }
    };
    getCP();
  }, [report.cpId, user.isAdmin]);

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-grayish">Report Details</h1>
        {loading ? (
          <>Processing...</>
        ) : report.status.toLowerCase() !== "pending" ? (
          <div className="flex items-center gap-2">
            <div
              className={`w-[0.75rem] h-[0.75rem] rounded-full`}
              style={{
                backgroundColor:
                  report.status === "Done" ? "var(--primary-green)" : "red",
              }}
            ></div>
            <span>{report.status}</span>
          </div>
        ) : (
          <div className="flex items-center gap-4"></div>
        )}
      </div>

      <div className="border-2 p-6 rounded-lg">
        <h1 className="text-xl text-grayish flex flex-col gap-2">
          <div>
            Report Id: <span className="text-black">{report.reportId}</span>
          </div>

          {user.isAdmin && (
            <div>
              Control Panel: <span className="text-black">{cp.username}</span>
            </div>
          )}
        </h1>

        <div className="flex mt-4 flex-col">
          <h1 className="text-2xl text-grayish">Valid Trips </h1>
          <table className="border-collapse w-full text-left mt-4">
            <thead>
              <tr className="font-light">
                <th className="py-3 font-normal">Driver</th>
                <th className="py-3 font-normal">Vehicle Number</th>
                <th className="py-3 font-normal">Trip Date</th>
                <th className="py-3 font-normal">Trip Id</th>
              </tr>
            </thead>
            <tbody>
              {report.validTrips.map((trip, index) => (
                <tr key={index}>
                  <td className="py-4">{trip.driverName}</td>
                  <td className="py-4">{trip.vehicleNumber}</td>
                  <td className="py-4">{trip.tripDate}</td>
                  <td className="py-4">{trip.tripID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex mt-4 flex-col">
          <h1 className="text-2xl text-grayish">Invalid Trips </h1>
          <table className="border-collapse w-full text-left mt-4">
            <thead>
              <tr className="font-light">
                <th className="py-3 font-normal">Driver</th>
                <th className="py-3 font-normal">Vehicle Number</th>
                <th className="py-3 font-normal">Trip Date</th>
                <th className="py-3 font-normal">Trip Id</th>
              </tr>
            </thead>
            <tbody>
              {report.inValidTrips.map((trip, index) => (
                <tr key={index}>
                  <td className="py-4">{trip.driverName}</td>
                  <td className="py-4">{trip.vehicleNumber}</td>
                  <td className="py-4">{trip.tripDate}</td>
                  <td className="py-4">{trip.tripID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewedReport;
