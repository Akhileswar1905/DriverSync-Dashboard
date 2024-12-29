import { useState, useEffect } from "react";
import { getCpDrivers } from "../lib/utils";

const useFetchDrivers = (userId) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const drivers = await getCpDrivers(userId).catch((err) => {
          console.error("Error fetching drivers:", err);
          throw err;
        });
        setDrivers(drivers);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDrivers();
    }
  }, [userId]);

  return { drivers, loading, error };
};

export default useFetchDrivers;
