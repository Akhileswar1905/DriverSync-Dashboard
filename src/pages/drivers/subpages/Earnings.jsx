import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaFilter } from "react-icons/fa"; // Import filter icon
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const Earnings = () => {
  const location = useLocation();
  const { driver } = location.state;
  const earnings = driver?.earnings || [];

  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page

  // Function to parse DD-MM-YYYY into YYYY-MM-DD
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  // Filter trips based on the selected filter
  const filteredTrips = earnings
    .sort((a, b) => parseDate(b.tripDate) - parseDate(a.tripDate)) // Sort by tripDate in descending order
    .filter((trip) => {
      const tripDate = parseDate(trip.tripDate);
      if (filterType === "dateRange") {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return (!start || tripDate >= start) && (!end || tripDate <= end);
      } else if (filterType === "monthly") {
        const [year, month] = selectedMonth.split("-");
        return (
          tripDate.getFullYear() === parseInt(year, 10) &&
          tripDate.getMonth() + 1 === parseInt(month, 10)
        );
      }
      return true; // "all" filter
    });

  // Calculate total earnings
  const totalEarnings = filteredTrips
    .reduce((total, trip) => total + parseFloat(trip.amount || 0), 0)
    .toFixed(2);

  // Format the earnings with commas
  const formattedEarnings = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalEarnings);

  // Calculate the percentage for the circular progress bar
  // const earningsPercentage = (totalEarnings / 5000) * 100; // Assuming 5000 as the target earnings

  // Pagination Logic: Get trips for the current page
  const indexOfLastTrip = currentPage * itemsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - itemsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-white  rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[var(--grayish)] flex items-center justify-between ">
        Total Earnings
        {/* Filter Icon to Open Dialog Box */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-4 py-2 border-2 rounded-md text-[var(--primary-green)] "
        >
          <FaFilter size={20} />
        </button>
      </h2>

      {/* Driver Bank details table*/}
      <table className="">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-[var(--grayish)]">
              Account Number
            </th>
            <th className="px-4 py-2 text-left text-[var(--grayish)]">PAN</th>
            <th className="px-4 py-2 text-left text-[var(--grayish)]">
              IFSC Number
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 text-left">{driver.AccNumber}</td>
            <td className="px-4 py-2 text-left">{driver.PAN}</td>
            <td className="px-4 py-2 text-left">{driver.IFSC}</td>
          </tr>
        </tbody>
      </table>

      {/* Earnings Display */}
      <div className="text-5xl font-bold text-[var(--primary-green)] text-center m-4 p-8">
        ₹ {formattedEarnings}
      </div>

      {/* Modal for Filters */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Filter Earnings</h3>
            <div className="flex flex-col gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="all">All Time</option>
                <option value="dateRange">Filter by Date Range</option>
                <option value="monthly">Filter by Month</option>
              </select>

              {/* Conditional Inputs for Filters */}
              {filterType === "dateRange" && (
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full"
                    placeholder="End Date"
                  />
                </div>
              )}

              {filterType === "monthly" && (
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full"
                />
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[var(--primary-green)] text-white rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trips Table */}
      <div className="mt-6">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="py-2 text-left text-gray-600">Trip Date</th>
              <th className="py-2 text-left text-gray-600">Amount</th>
              <th className="py-2 text-left text-gray-600">Paid On</th>
              <th className="py-2 text-left text-gray-600">Trip Id</th>
            </tr>
          </thead>
          <tbody>
            {currentTrips.map((trip, index) => (
              <tr key={index}>
                <td className="py-2">{trip.tripDate}</td>
                <td className="py-2">{`₹ ${trip.amount}`}</td>
                <td className="py-2">{trip.paidOn}</td>
                <td className="py-2">{trip.tripID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-5 mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <GrFormPrevious />
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredTrips.length / itemsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          disabled={
            currentPage === Math.ceil(filteredTrips.length / itemsPerPage)
          }
        >
          <GrFormNext />
        </button>
      </div>
    </div>
  );
};

export default Earnings;
