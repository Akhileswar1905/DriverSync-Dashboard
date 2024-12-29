import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Modal from "./components/Model";
import { FaPlus } from "react-icons/fa6";
import {
  assignContractDriver,
  assignContractPanel,
  getCp,
  getDriver,
} from "../../lib/utils";

const ContractDetailsPage = () => {
  const location = useLocation();
  const { contract } = location.state;
  const [drivers, setDrivers] = useState([]);
  const [controlPanels, setControlPanels] = useState([]);
  const { user } = useContext(UserContext);
  const [isModalOpen, setModalOpen] = useState(false); // State for modal
  const [selectedPanels, setSelectedPanels] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState([]);
  const [filteredPanels, setFilteredPanels] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssigningPanels = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await assignContractPanel(contract, selectedPanels);
    if (res) {
      setLoading(false);
      closeModal();
    } else {
      setLoading(false);
      setErr("Failed to assign panels to contract");
    }
  };
  const handleAssigningDrivers = async (e) => {
    e.preventDefault();
    const res = await assignContractDriver(contract, selectedDriver);
    if (res) {
      closeModal();
    } else {
      setErr("Failed to assign driver to contract");
    }
  };

  useEffect(() => {
    const fetcher = async () => {
      if (user) {
        if (!user.isAdmin) {
          const matchingDrivers = [];
          const otherDrivers = [];
          for (const d of user.drivers) {
            const driver = await getDriver(d);

            if (
              Array.isArray(driver.contractDetails) &&
              driver.contractDetails.length > 0
            ) {
              const hasMatchingContract = driver.contractDetails.some(
                (con) => con.contractId === contract.contractId
              );

              if (hasMatchingContract) {
                matchingDrivers.push(driver);
              } else {
                otherDrivers.push(driver);
              }
            } else {
              otherDrivers.push(driver);
            }
          }
          setDrivers(matchingDrivers);
          setFilteredDrivers(otherDrivers);
        } else {
          const matchingPanels = [];
          const otherPanels = [];
          for (const p of user.controlPanels) {
            console.log(p);
            const panel = await getCp(p);

            if (Array.isArray(panel.contracts) && panel.contracts.length > 0) {
              const hasMatchingContract = panel.contracts.some(
                (con) => con.contractId === contract.contractId
              );

              if (hasMatchingContract) {
                matchingPanels.push(panel);
              } else {
                otherPanels.push(panel);
              }
            } else {
              otherPanels.push(panel);
            }
          }
          setControlPanels(matchingPanels);
          setFilteredPanels(otherPanels);
        }
      }
    };
    fetcher();
  }, [user, contract.contractId]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  console.log(filteredPanels);

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl text-[var(--grayish)]">Contract Details</h1>
        <button
          onClick={openModal}
          className="bg-primary-green px-4 py-2 rounded-lg text-white flex gap-4 items-center"
        >
          Assign Contract
          <FaPlus />
        </button>
      </div>
      <div className="border-2 rounded-lg p-6 flex flex-col gap-5">
        <div className="flex items-center gap-12">
          <div className="w-[200px] h-[200px] rounded-full bg-[#ddd]"></div>
          <div className="flex flex-col gap-2">
            <p className="mt-4 text-base text-[var(--grayish)]">
              {contract.contractId}
            </p>
            <p className="text-3xl">{contract.companyName}</p>
            <p className="mt-1 text-base text-[var(--grayish)]">
              {contract.contactNumber}
            </p>
          </div>
        </div>
        <div>
          {!user.isAdmin ? (
            <>
              <h2 className="text-3xl text-[var(--grayish)]">
                Drivers Assigned to
              </h2>
              <table className="border-collapse w-full text-left my-5">
                <thead className="text-[var(--grayish)]">
                  <tr>
                    <th className="font-normal">Driver Name</th>
                    <th className="font-normal">Phone Number</th>
                    <th className="font-normal">Vehicle Number</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <tr key={driver._id}>
                        <td className="py-2">{driver.username}</td>
                        <td className="py-2">{driver.phoneNumber}</td>
                        <td className="py-2">{driver.vehicleNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2 className="text-3xl text-[var(--grayish)]">
                Control Panels Assigned to
              </h2>
              <table className="border-collapse w-full text-left my-5">
                <thead className="text-[var(--grayish)]">
                  <tr>
                    <th className="font-normal">Control Panel Name</th>
                    <th className="font-normal">Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {controlPanels.length > 0 ? (
                    controlPanels.map((panel) => (
                      <tr key={panel._id}>
                        <td className="py-2">{panel.username}</td>
                        <td className="py-2">{panel.phoneNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={user.isAdmin ? "Assign Control Panel" : "Assign Driver"}
      >
        <table className="border-collapse w-full text-left my-5 ">
          <thead>
            <tr>
              <th className="font-normal">Name</th>
              <th className="font-normal">Phone Number</th>
              <th className="font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {user.isAdmin
              ? filteredPanels.map((panel) => (
                  <>
                    <tr key={panel._id} className="">
                      <td className="pt-3">{panel.username}</td>
                      <td className="pt-3">{panel.phoneNumber}</td>
                      <td className="pt-3">
                        {selectedPanels.includes(panel._id) ? (
                          <button
                            className="text-red-800"
                            onClick={() => {
                              setSelectedPanels(
                                selectedPanels.filter((id) => id !== panel._id)
                              );
                            }}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className="text-primary-green"
                            onClick={() =>
                              setSelectedPanels([...selectedPanels, panel._id])
                            }
                          >
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  </>
                ))
              : filteredDrivers.map((driver) => (
                  <tr key={driver._id}>
                    <td>{driver.username}</td>
                    <td>{driver.phoneNumber}</td>
                    <td>
                      {selectedDriver.includes(driver._id) ? (
                        <button
                          className="text-red-800"
                          onClick={() => {
                            setSelectedDriver(
                              selectedDriver.filter((id) => id !== driver._id)
                            );
                          }}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          className="text-primary-green"
                          onClick={() =>
                            setSelectedDriver([...selectedDriver, driver._id])
                          }
                        >
                          Assign
                        </button>
                      )}{" "}
                    </td>
                  </tr>
                ))}
          </tbody>
          {selectedPanels.length > 0 && (
            <tr>
              {loading ? (
                <button
                  type="button"
                  className="px-2 py-2  rounded-lg mt-5"
                  disabled
                >
                  <svg
                    className="animate-spin h-5 w-5 mr-3 ..."
                    viewBox="0 0 24 24"
                  ></svg>
                  Processing...
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-primary-green rounded-lg mt-5 text-white"
                  onClick={(e) => {
                    handleAssigningPanels(e);
                  }}
                >
                  Proceed
                </button>
              )}

              {err && <p className="text-red-950 mt-4">{err}</p>}
            </tr>
          )}
          {selectedDriver && selectedDriver.length > 0 && (
            <tr>
              {loading ? (
                <button
                  type="button"
                  className="py-2  rounded-lg mt-5 "
                  disabled
                >
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  ></svg>
                  Processing...
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-primary-green rounded-lg mt-5 text-white"
                  onClick={(e) => {
                    handleAssigningDrivers(e);
                  }}
                >
                  Proceed
                </button>
              )}

              {err && <p className="text-red-950 mt-4">{err}</p>}
            </tr>
          )}
        </table>
      </Modal>
    </div>
  );
};

export default ContractDetailsPage;
