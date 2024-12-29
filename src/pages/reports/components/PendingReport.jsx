import React, { useContext, useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { UserContext } from "../../../context/UserContext";
import {
  sendApprovalRequest,
  sendPayRequest,
  sendRejectionRequest,
} from "../../../lib/utils";

const PendingReport = () => {
  const location = useLocation();
  const { report } = location.state;
  const { user } = useContext(UserContext);

  // State for file upload, evaluation, and modal visibility
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTrips, setCurrentTrips] = useState([]);
  const [evaluationDone, setEvaluationDone] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inValidTrips, setInValidTrips] = useState([]);
  const [validTrips, setValidTrips] = useState([]);
  const tripsPerPage = 10;
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  const totalPages = Math.ceil(
    (report.allPendingTrips || []).length / tripsPerPage
  );
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;

  useEffect(() => {
    const trips = (report.allPendingTrips || []).slice(
      indexOfFirstTrip,
      indexOfLastTrip
    );
    if (inValidTrips.length > 0) {
      // Remove the invalid trips from the list
      const validTrips = trips.filter((trip) => !inValidTrips.includes(trip));
      setCurrentTrips(validTrips);
    } else setCurrentTrips(trips);
  }, [
    report.allPendingTrips,
    currentPage,
    indexOfFirstTrip,
    indexOfLastTrip,
    inValidTrips,
  ]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEvaluate = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFile(null);
  };

  const processFile = () => {
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop();
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      let parsedData;

      if (fileExtension === "csv" || fileExtension === "tsv") {
        parsedData = Papa.parse(data, { header: true }).data;
      } else if (fileExtension === "xlsx") {
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        parsedData = XLSX.utils.sheet_to_json(worksheet);
      }

      console.log(parsedData);
      const validatedData = parsedData.map((trip) => ({
        driverName: trip["Driver Name"],
        vehicleNumber: trip["Vehicle Number"],
        tripID: trip["Trip Id"],
        tripdate: trip["Trip Date"],
        phoneNumber: trip["Phone Number"],
        tripDate: new Date().toISOString(trip["Trip Date"]),
        tripPayment: "Pending",
      }));

      let tempInValidTrips = [];
      let tempValidTrips = [];

      report.allPendingTrips.map((trip) => {
        const foundTrip = validatedData.find(
          (data) =>
            "" + trip.tripID === "" + data.tripID &&
            // new Date(trip.tripDate) === new Date(data.tripDate) &&
            trip.vehicleNumber === data.vehicleNumber &&
            trip.phoneNumber === "" + data.phoneNumber
        );

        if (!foundTrip) {
          tempInValidTrips.push(trip);
        } else {
          tempValidTrips.push(trip);
        }
        return foundTrip || null;
      });
      setInValidTrips(tempInValidTrips);
      console.log(tempValidTrips);

      // const filteredTrips = updatedTrips.filter((trip) => trip !== null);

      setCurrentTrips(tempValidTrips);
      // setCurrentTrips(filteredTrips);
      setValidTrips(tempValidTrips);
      setEvaluationDone(true);
      setModalVisible(false);
    };

    if (fileExtension === "csv" || fileExtension === "tsv") {
      reader.readAsText(selectedFile);
    } else if (fileExtension === "xlsx") {
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleAccept = async () => {
    console.log("Accept");
    setProcessing(true);
    const cpId = report.cpId;
    const reportId = report.reportId;
    const data = {
      cpId,
      reportId,
      validTrips: validTrips,
      inValidTrips: inValidTrips,
      status: "Pending",
      reportDate: report.reportDate,
    };
    console.log(data);
    const res = await sendApprovalRequest(data);
    if (res) {
      setProcessing(false);
      navigate(-1);
      setStatus("Accepted");
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    console.log("Rejected");
    const cpId = report.cpId;
    const reportId = report.reportId;
    const data = {
      cpId,
      reportId,
      validTrips: currentTrips,
      inValidTrips: inValidTrips,
      status: "Pending",
    };

    // console.log(data);
    const res = await sendRejectionRequest(data);
    if (res) {
      setProcessing(false);
      setStatus("Rejected");
    }
  };

  const handleSubmit = async () => {
    console.log("Request sent for report:", report.reportId);
    setLoading(true);
    const res = await sendPayRequest(report);
    if (res) {
      setStatus("Request Sent");
    } else {
      setStatus("Request Failed");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-grayish">Report Details</h1>
        {loading ? (
          <>Processing...</>
        ) : report.status !== "Pending" ? (
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
          <div className="flex items-center gap-4">
            {user?.isAdmin && !evaluationDone ? (
              <button
                className="bg-blue-400 px-4 py-2 rounded-lg text-white"
                onClick={handleEvaluate}
              >
                Evaluate
              </button>
            ) : evaluationDone ? (
              processing ? (
                <span>Processing...</span>
              ) : status ? (
                <span>Status: {status}</span>
              ) : (
                <div className="flex gap-4">
                  <button
                    className="bg-primary-green px-4 py-2 rounded-lg text-white"
                    onClick={handleAccept}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 px-4 py-2 rounded-lg text-white"
                    onClick={handleReject}
                  >
                    Reject
                  </button>
                </div>
              )
            ) : !status ? (
              <button
                className="bg-primary-green px-4 py-2 rounded-lg text-white"
                onClick={handleSubmit}
              >
                Send Request
              </button>
            ) : (
              <span>{status}</span>
            )}
          </div>
        )}
      </div>

      <div className="border-2 p-6 rounded-lg">
        <h1 className="text-xl text-grayish">
          Report Id: <span className="text-black">{report.reportId}</span>
        </h1>
        <table className="border-collapse w-full text-left mt-4">
          <thead>
            <tr className="font-light">
              <th className="py-3 font-normal">Driver</th>
              <th className="py-3 font-normal">Vehicle Number</th>
              <th className="py-3 font-normal">Trip Date</th>
              <th className="py-3 font-normal">Trip Id</th>
              {/* <th className="py-3 font-normal">Payment Status</th> */}
            </tr>
          </thead>
          <tbody>
            {currentTrips.map((trip, index) => (
              <tr key={index}>
                <td className="py-4">{trip.driverName}</td>
                <td className="py-4">{trip.vehicleNumber}</td>
                <td className="py-4">{trip.tripDate}</td>
                <td className="py-4">{trip.tripID}</td>
                {/* <td className="py-4">{trip.tripPayment}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 items-center">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="text-[var(--grayish)]"
        >
          <GrFormPrevious />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageClick(i + 1)}
            className={`px-1 py-1 w-1 h-1 border rounded-lg mx-1 ${
              currentPage === i + 1
                ? "bg-[var(--grayish)] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          ></button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="text-[var(--grayish)]"
        >
          <GrFormNext />
        </button>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-2xl mb-4">Upload File</h2>
            <input
              type="file"
              accept=".csv,.xlsx,.tsv"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={processFile}
                className="bg-blue-500 px-4 py-2 text-white rounded-lg"
              >
                Process
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-400 px-4 py-2 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingReport;
