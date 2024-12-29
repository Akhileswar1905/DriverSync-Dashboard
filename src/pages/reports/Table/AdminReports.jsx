import React, { useContext, useEffect, useState } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiFilterAlt } from "react-icons/bi";
import { UserContext } from "../../../context/UserContext";
import { NavLink } from "react-router-dom";
import { getCp } from "../../../lib/utils";

const AdminReports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Status filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [reports, setReports] = useState([]);

  const rowsPerPage = 10;

  useEffect(() => {
    if (user?.payReqs) {
      setReports(
        user.payReqs.sort(
          (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
        )
      );
      console.log("Pay reqs", user.payReqs);
    }
  }, [user, user?.payReqs]);

  // Filter data
  const filteredData = reports.filter((row) => {
    const matchesName = row.reportId
      .toLowerCase()
      .includes(filter.toLowerCase());
    const matchesStatus = statusFilter ? row.status === statusFilter : true;
    const withinDateRange =
      (!startDate || new Date(row.date) >= new Date(startDate)) &&
      (!endDate || new Date(row.date) <= new Date(endDate));

    return matchesName && matchesStatus && withinDateRange;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleApplyFilter = () => {
    setIsDateFilterOpen(false);
  };

  const statusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-500"; // Green for Approved
      case "Rejected":
        return "bg-red-500"; // Red for Rejected
      case "Pending":
        return "bg-yellow-500"; // Yellow for Pending
      default:
        return "";
    }
  };

  return (
    <div className="border-2 px-8 py-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl text-[var(--grayish)]">Transaction Reports</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg w-56"
            >
              <option value="">Filter by Status</option>
              <option value="Done">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <button
            onClick={() => setIsDateFilterOpen(true)}
            className="text-[var(--grayish)] cursor-pointer flex items-center gap-1"
          >
            <BiFilterAlt size={25} />
            Filter by Date
          </button>
        </div>
      </div>

      {/* Date Range Filter Dialog */}
      {isDateFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-10 rounded-lg shadow-lg relative flex flex-col gap-5">
            <h3 className="text-xl font-semibold mb-4 text-[var(--grayish)] ">
              Filter by Date Range
            </h3>
            <div className="flex gap-4 flex-col">
              <div>
                <label className="block text-[var(--grayish)]">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full text-[var(--grayish)]"
                />
              </div>
              <div>
                <label className="block text-[var(--grayish)]">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full text-[var(--grayish)]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsDateFilterOpen(false)}
                className="px-4 py-2 rounded-lg border-2"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilter}
                className="px-4 py-2 rounded-lg bg-[var(--primary-green)] text-white"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="border-collapse w-full text-left my-5">
        <thead className="text-[var(--grayish)]">
          <tr className="font-light">
            <th className="py-3 font-normal">Transaction Id</th>

            <th className="py-3 font-normal">Date of Creation</th>
            <th className="py-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, index) => (
              <tr key={index} className="cursor-pointer gap-1">
                <NavLink
                  to={`/transaction-reports/${row.reportId}`}
                  state={{ report: row }}
                >
                  <td className="py-4">{row.reportId}</td>
                </NavLink>

                <td className="py-4">
                  {new Date(row.reportDate).toISOString().split("T")[0]}
                </td>
                <td className="py-4 flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${statusColor(
                      row.status
                    )}`}
                  ></span>
                  {row.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 items-center">
          <button
            onClick={() => changePage(currentPage - 1)}
            className="text-[var(--grayish)]"
            disabled={currentPage === 1}
          >
            <GrFormPrevious />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-1 py-1 w-1 h-1 border rounded-lg mx-1 ${
                currentPage === i + 1
                  ? "bg-[var(--grayish)] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            ></button>
          ))}
          <button
            className="text-[var(--grayish)]"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <GrFormNext />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
