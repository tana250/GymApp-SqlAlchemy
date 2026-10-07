import { useCallback, useEffect, useState } from "react";
import socioPlanesApi from "../services/socioPlanesApi";

export function useSocioPlanes() {
  const [socioPlanes, setSocioPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSocioPlanes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await socioPlanesApi.getAll();

      setSocioPlanes(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSocioPlanes();
  }, [loadSocioPlanes]);

  const assignPlan = useCallback(
    async (socioId, planId) => {
      try {
        setError(null);

        await socioPlanesApi.insert({
          socioId,
          planId,
        });

        await loadSocioPlanes();
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadSocioPlanes]
  );

  const removePlan = useCallback(
    async (socioId, planId) => {
      try {
        setError(null);

        await socioPlanesApi.remove(
          socioId,
          planId
        );

        await loadSocioPlanes();
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadSocioPlanes]
  );

  return {
    socioPlanes,
    loading,
    error,
    loadSocioPlanes,
    assignPlan,
    removePlan,
  };
}