import { useCallback, useEffect, useState } from "react";
import cuotasApi from "../services/cuotasApi";

export function useCuotas() {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const loadCuotas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await cuotasApi.getAll();

      setCuotas(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCuotas();
  }, [loadCuotas]);

  const getCuota = useCallback(async (id) => {
    return cuotasApi.getById(id);
  }, []);

  const generarCuotas = useCallback(
    async (año, mes) => {
      try {
        setGenerating(true);
        setError(null);

        const resultado =
          await cuotasApi.generar(
            año,
            mes
          );

        await loadCuotas();

        return resultado;
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setGenerating(false);
      }
    },
    [loadCuotas]
  );

  const deleteCuota = useCallback(async (id) => {
    await cuotasApi.remove(id);

    setCuotas((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }, []);

  return {
    cuotas,

    loading,
    generating,
    error,

    loadCuotas,
    getCuota,

    generarCuotas,
    deleteCuota,
  };
}