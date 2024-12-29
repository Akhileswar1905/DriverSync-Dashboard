import React from "react";
import { useLocation } from "react-router-dom";

const DriverContracts = () => {
  const location = useLocation();
  const { driver } = location.state;

  return (
    <div className="p-6 border-2 rounded-lg mt-5">
      <h1 className="text-3xl text-[var(--grayish)]">Driver Contracts</h1>
      <table className="border-collapse w-full text-left my-5">
        <thead className="text-[var(--grayish)]">
          <tr className="font-light">
            <th className="py-3 font-normal">Company Name</th>
            <th className="py-3 font-normal">Amount</th>
            <th className="py-3 font-normal">Start Date</th>
            <th className="py-3 font-normal">End Date</th>
          </tr>
        </thead>
        <tbody>
          {driver?.contractDetails.map((contract) => (
            <tr className="font-light" key={contract.contractId}>
              <td className="py-2">{contract.companyName}</td>
              <td className="py-2">{contract.amount}</td>
              <td className="py-2">{contract.startDate}</td>
              <td className="py-2">{contract.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverContracts;
