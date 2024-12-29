import React, { useState } from "react";
// import React, { useContext, useState } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiFilterAlt } from "react-icons/bi";
// import { UserContext } from "../../../../context/UserContext";
// import { getContract } from "../../../../lib/utils";

const TripsTable = ({ driver }) => {
  const trips = driver.tripDetails || []; // Ensure tripDetails exists
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

  const rowsPerPage = 5;

  // Utility function to convert DD/MM/YYYY to YYYY-MM-DD
  const normalizeDate = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const filteredData = trips.filter((row) => {
    const matchesName = row.tripID.toLowerCase().includes(filter.toLowerCase());
    const matchesPaymentStatus =
      !paymentStatusFilter || row.tripPayment === paymentStatusFilter;

    // Normalize the trip date
    const normalizedTripDate = normalizeDate(row.tripDate);
    console.log(startDate, endDate);
    console.log(normalizedTripDate);
    const withinDateRange =
      (!startDate || normalizedTripDate >= startDate) &&
      (!endDate || normalizedTripDate <= endDate);

    return matchesName && matchesPaymentStatus && withinDateRange;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const statusColors = {
    pending: "bg-yellow-300",
    Done: "bg-green-500",
    Rejected: "bg-red-500",
  };

  // const { user } = useContext(UserContext);
  console.log(trips);

  return (
    <div className="border-2 px-8 py-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl text-[var(--grayish)]">Trips</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by Trip Id..."
            className="border px-3 py-2 rounded-lg w-56"
          />
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg w-56"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="Done">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={() => setIsDateFilterOpen(true)}
            className="text-[var(--grayish)] cursor-pointer flex items-center gap-1"
          >
            <BiFilterAlt size={25} />
            Filter by Date
          </button>
        </div>
      </div>

      {isDateFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-10 rounded-lg shadow-lg relative flex flex-col gap-5">
            <h3 className="text-xl font-semibold mb-4 text-[var(--grayish)]">
              Filter by Date Range
            </h3>
            <div className="flex flex-col gap-4">
              <label>
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full"
                />
              </label>
              <label>
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full"
                />
              </label>
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
            <th className="py-3 font-normal">Trip id</th>
            {/* <th className="py-3 font-normal">Contract</th> */}
            <th className="py-3 font-normal">Date</th>
            <th className="py-3 font-normal">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, index) => (
              <tr className="cursor-pointer" key={index}>
                <td className="py-4">{row.tripID}</td>
                {/* <td className="py-4">{getContract(row.contract, user)}</td> */}
                <td className="py-4">{row.tripDate}</td>
                <td className="py-4 flex items-center gap-2 capitalize">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      statusColors[row.tripPayment]
                    }`}
                  ></span>
                  {row.tripPayment}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

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

export default TripsTable;
