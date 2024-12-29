import React, { useContext, useState } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { UserContext } from "../../../../context/UserContext";
import { NavLink } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";

const Table = () => {
  const { user } = useContext(UserContext);
  const data = user.isAdmin ? user.payReqs : user.reports;

  // Sort the data by reportDate in descending order
  data.sort((a, b) => {
    const dateA = new Date(a.reportDate);
    const dateB = new Date(b.reportDate);
    return dateB - dateA;
  });

  // Get only top 10 records in data
  data.splice(10);

  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

  const rowsPerPage = 10;

  // Filter data
  const filteredData = data.filter((row) => {
    const withinDateRange =
      (!startDate || row.reportDate >= startDate) &&
      (!endDate || row.reportDate <= endDate);
    return withinDateRange;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="w-[66%] border-2 px-8 py-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl text-[var(--grayish)]">Recent Transactions</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"></div>
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
                onClick={() => setIsDateFilterOpen(false)}
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
            <th className="py-3 font-normal">Report Id</th>
            <th className="py-3 font-normal">Report Date</th>
            <th className="py-3 font-normal">Status</th>
            {/* <th className="py-3 font-normal">Amount Paid</th>
            <th className="py-3 font-normal">Date</th> */}
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, index) => (
              <tr key={index}>
                <NavLink
                  to={`/transaction-reports/${row.reportId}`}
                  state={{ report: row }}
                >
                  <td className="py-4 ">{row.reportId}</td>
                </NavLink>{" "}
                <td className="py-2">{row.reportDate}</td>
                <td className="py-2">{row.status}</td>
                {/* <td className="py-2">{row.amountPaid}</td> */}
                {/* <td className="py-2">{row.date}</td> */}
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
      {totalPages > 0 && (
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

export default Table;
