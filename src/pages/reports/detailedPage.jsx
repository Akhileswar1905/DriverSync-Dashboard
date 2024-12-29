import { useLocation } from "react-router-dom";
import PendingReport from "./components/PendingReport";
import ReviewedReport from "./components/ReviewedReport";

const TransactionReportDetailsPage = () => {
  const location = useLocation();
  const { report } = location.state;

  return (
    <div>
      {report.status.toLowerCase() === "pending" ? (
        <PendingReport report={report} />
      ) : (
        <ReviewedReport report={report} />
      )}
    </div>
  );
};

export default TransactionReportDetailsPage;
