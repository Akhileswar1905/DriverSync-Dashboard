import axios from "axios";

// const base_url = "http://localhost:5050/";
const base_url = process.env.REACT_APP_BASE_URL;

export const acceptDriver = async (id) => {
  console.log(id);
  let url = `${base_url}/cp/accept/`;
  const res = await axios.post(url, { id: id });
  console.log(res.data);
  return res.data;
};

export const rejectDriver = async (id) => {
  let url = `${base_url}/cp/reject/`;
  const res = await axios.post(url, { id: id });
  console.log(res.data);
  return res.data;
};

export const getAllDrivers = async () => {
  let url = `${base_url}/driver`;
  console.log(url);
  const res = await axios.get(url);
  return res.data;
};

export const createContract = async (form) => {
  let url = `${base_url}/admin/contract`;
  const res = await axios.post(url, form);
  console.log(res.data);
  return res.data;
};

export const createPanel = async (form) => {
  let url = `${base_url}/cp/signup`;
  const res = await axios.post(url, form);
  console.log(res.data);
  return res.data;
};

export const assignContractPanel = async (contract, panels) => {
  let url = `${base_url}/admin/assignContract`;
  const res = await axios.post(url, { contract: contract, cps: panels });
  console.log(res.data);
  return res.data;
};

export const assignContractDriver = async (contract, drivers) => {
  let url = `${base_url}/cp/contract`;
  const res = await axios.post(url, { contract: contract, drivers: drivers });
  console.log(res.data);
  return res.data;
};

export const generateReport = async (id) => {
  let url = `${base_url}/cp/generate-report/${id}`;
  const res = await axios.post(url);
  console.log(res.data);
  return res.data;
};

export const sendPayRequest = async (report) => {
  let url = `${base_url}/cp/payreq`;
  const res = await axios.post(url, report);
  console.log(res.data);
  return res.data;
};

export const sendApprovalRequest = async (report) => {
  const url = `${base_url}/admin/acceptReq/${report.reportId}`;
  const res = await axios.post(url, report);
  console.log(res.data);
  return res.data;
};

export const sendRejectionRequest = async (report) => {
  let url = `${base_url}/admin/rejectReq/${report.reportId}`;
  const res = await axios.post(url, report);
  console.log(res.data);
  return res.data;
};

export const acceptUpdateReq = async (trip) => {
  let url = `${base_url}/cp/accept-update-request`;
  const res = await axios.post(url, trip);
  console.log(res.data);
  return res.data;
};

export const getCpDrivers = async (cpId) => {
  let url = `${base_url}/cp/all-drivers/${cpId}`;
  const res = await axios.get(url);
  return res.data;
};

export const getCp = async (cpId) => {
  let url = `${base_url}/cp/${cpId}`;
  const res = await axios.get(url);
  console.log(res.data);
  return res.data;
};

export const getCps = async () => {
  let url = `${base_url}/cp`;
  const res = await axios.get(url);
  return res.data;
};

export const getDriver = async (id) => {
  let url = `${base_url}/driver/${id}`;
  const res = await axios.get(url);
  console.log(res.data);
  return res.data;
};

export const parseDate = (dateStr) => {
  if (typeof dateStr === "string") {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
};

export const getContract = (contractId, user) => {
  console.log(contractId);
  const con = user?.contracts.findIndex(
    (contract) => contract.contractId === contractId
  );
  return user?.contracts[con] ? user.contracts[con].companyName : "";
};
