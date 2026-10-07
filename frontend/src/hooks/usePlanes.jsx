import {
  useCallback,
  useEffect,
  useState,
} from "react";

import planesApi from "../services/planesApi";


export default function usePlanes() {

  const [planes, setPlanes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  const loadPlanes = useCallback(async () => {

    try {

      setLoading(true);
      setError(null);

      const data = await planesApi.getAll();

      setPlanes(data);

    } catch (error) {

      setError(error);

    } finally {

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

    const nuevoPlan = await planesApi.insert(plan);

    setPlanes((prev) => [
      ...prev,
      nuevoPlan,
    ]);

    return nuevoPlan;

  }, []);


  const updatePlan = useCallback(
    async (id, plan) => {

      const planActualizado =
        await planesApi.update(
          id,
          plan
        );

      setPlanes((prev) =>
        prev.map((item) =>
          item.id === id
            ? planActualizado
            : item
        )
      );

      return planActualizado;

    },
    []
  );


  const deactivatePlan = useCallback(
    async (id) => {

      const planActualizado =
        await planesApi.deactivate(id);

      setPlanes((prev) =>
        prev.map((item) =>
          item.id === id
            ? planActualizado
            : item
        )
      );

      return planActualizado;

    },
    []
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
  };
}