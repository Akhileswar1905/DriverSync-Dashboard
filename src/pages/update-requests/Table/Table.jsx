import React, { useContext, useEffect, useState } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiFilterAlt } from "react-icons/bi";
import { UserContext } from "../../../context/UserContext";
import { acceptUpdateReq, getCpDrivers } from "../../../lib/utils";
import SkeletonLoader from "../../../components/Skeleton/SkeletonLoader";

const Table = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
    setRequests(user.updates);
    // setDrivers(user.drivers || []);
    const fetchDrivers = async () => {
      try {
        const drivers = await getCpDrivers(user._id).catch((err) => {
          console.error("Error fetching drivers:", err);
          throw err;
        });
        if (drivers) {
          setLoading(false);
          setDrivers(drivers);
        }
      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
    };
    fetchDrivers();
  }, [user]);

  // console.log(drivers);

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const rowsPerPage = 10;

  const getDriverName = (phoneNumber) => {
    const driver = drivers?.find((d) => d.phoneNumber === phoneNumber);
    console.log(driver);
    return driver ? driver.username : "Unknown Driver";
  };

  const filteredData = requests.filter((row) =>
    getDriverName(row.phoneNumber).toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleAccept = async (trip) => {
    // alert("Request Accepted");
    const res = await acceptUpdateReq(trip);
    setRequests(res);
  };

  return (
    <div className="border-2 px-8 py-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl text-gray-700">Update Requests</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by Driver Name..."
            className="border px-3 py-2 rounded-lg w-56"
          />
          <button className="flex items-center gap-1 text-gray-700">
            <BiFilterAlt size={25} />
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <>
          <table className="border-collapse w-full text-left my-5">
            <thead className="text-[var(--grayish)]">
              <tr className="font-light">
                <th className="py-3 font-normal">Driver Name</th>
                <th className="py-3 font-normal">Phone Number</th>
                <th className="py-3 font-normal">Trip ID</th>
                <th className="py-3 font-normal">Trip Date</th>
                <th className="py-3 font-normal">Action</th>
              </tr>
            </thead>
          </table>
          <div className="grid gap-4">
            {Array.from({ length: rowsPerPage }).map((_, index) => (
              <SkeletonLoader key={index} count={5} />
            ))}
          </div>
        </>
      ) : (
        <table className=" border-collapse w-full text-left my-5">
          <thead className="text-[var(--grayish)]">
            <tr className="font-light">
              <th className="py-3 font-normal">Driver Name</th>
              <th className="py-3 font-normal">Phone Number</th>
              <th className="py-3 font-normal">Trip ID</th>
              <th className="py-3 font-normal">Trip Date</th>
              <th className="py-3 font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, index) => (
                <tr key={index}>
                  <td className="py-2">{getDriverName(row.phoneNumber)}</td>
                  <td className="py-2">{row.phoneNumber}</td>
                  <td className="py-2">{row.trip.tripID}</td>
                  <td className="py-2">{row.trip.tripDate}</td>
                  <td className="py-2">
                    {row.trip.status === "not-allowed" ? (
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded-md"
                        onClick={() => handleAccept(row)}
                      >
                        Allow
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 bg-green-400 text-white rounded-md"
                        disabled
                      >
                        Allowed
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 items-center">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-gray-600"
          >
            <GrFormPrevious />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`mx-1 px-2 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-600"
          >
            <GrFormNext />
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
