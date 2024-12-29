import React, { useContext, useState } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { UserContext } from "../../../../context/UserContext";
import { NavLink } from "react-router-dom";

const ContractTable = () => {
  const { user, loading } = useContext(UserContext);
  const [companies, setCompanies] = useState(user?.contracts);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  const totalPages = Math.ceil(companies?.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = companies?.slice(startIndex, startIndex + rowsPerPage);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full border-2 px-8 py-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-[var(--grayish)]">New Contracts</h2>
      </div>
      <table className="border-collapse w-full text-left my-5">
        <thead className="text-[var(--grayish)]">
          <tr className="font-light">
            <th className="py-3 font-normal">Company Name</th>
          </tr>
        </thead>
        <tbody>
          {currentRows?.length > 0 ? (
            currentRows?.map((row, index) => (
              <tr key={index}>
                <NavLink
                  to={`/contracts/${row.contractId}`}
                  state={{ contract: row }}
                  className="hover:bg-gray-100"
                >
                  <td className="py-3 flex gap-4 items-center">
                    <div className="w-[25px] h-[25px] rounded-full bg-[#ddd]"></div>
                    {row.companyName}
                  </td>
                </NavLink>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-3">No contracts found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default ContractTable;
