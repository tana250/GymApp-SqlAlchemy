import { useCallback, useEffect, useRef, useState } from "react";

import planesApi from "../services/planesApi";


export default function usePlanes() {

  const [planes, setPlanes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // Ver useSocios: re-fetch tras cada mutación,
  // loading solo en la primera carga.
  const primeraCarga = useRef(true);


  const loadPlanes = useCallback(async () => {

    try {

      if (primeraCarga.current) {
        setLoading(true);
      }

      setError(null);

      const data = await planesApi.getAll();

      setPlanes(data);

    } catch (error) {
      setError(error);

    } finally {
      primeraCarga.current = false;
      setLoading(false);
    }

  }, []);


  useEffect(() => {
    loadPlanes();
  }, [loadPlanes]);


  const getPlan = useCallback(async (id) => {

    return planesApi.getById(id);

  }, []);


  const createPlan = useCallback(async (plan) => {

    try {
      setError(null);

      const nuevoPlan = await planesApi.insert(plan);

      await loadPlanes();

      return nuevoPlan;

    } catch (error) {
      setError(error);
      throw error;
    }

  }, [loadPlanes]);


  const updatePlan = useCallback(
    async (id, plan) => {

      try {
        setError(null);

        const planActualizado = await planesApi.update(
          id,
          plan
        );

        await loadPlanes();

        return planActualizado;

      } catch (error) {
        setError(error);
        throw error;
      }

    },
    [loadPlanes]
  );


  const deactivatePlan = useCallback(
    async (id) => {

      try {
        setError(null);

        const planActualizado = await planesApi.deactivate(id);

        await loadPlanes();

        return planActualizado;

      } catch (error) {
        setError(error);
        throw error;
      }

    },
    [loadPlanes]
  );


  const deletePlan = useCallback(
    async (id) => {

      try {
        setError(null);

        await planesApi.remove(id);

        await loadPlanes();

      } catch (error) {
        setError(error);
        throw error;
      }

    },
    [loadPlanes]
  );


  return {
    planes,
    loading,
    error,

    loadPlanes,
    getPlan,

    createPlan,
    updatePlan,
    deactivatePlan,
    deletePlan,
  };
}
