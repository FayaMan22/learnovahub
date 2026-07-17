import { useCallback, useEffect, useState } from "react";
import api from "../api/api";

export default function useSystemHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSystemHealth = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/admin/system-health");

      setHealth(response.data);
      setLastUpdated(new Date());
      
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Unable to load system health."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemHealth();

    const interval = setInterval(() => {
      fetchSystemHealth(true);
    }, 60000); //every 60 seconds

    return () => clearInterval(interval);
  }, [fetchSystemHealth]);

  return {
    health,
    loading,
    refreshing,
    error,
    lastUpdated,
    refreshHealth: () => fetchSystemHealth(true),
  };
}