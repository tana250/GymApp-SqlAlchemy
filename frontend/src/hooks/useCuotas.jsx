import { useCallback, useEffect, useRef, useState } from "react";
import cuotasApi from "../services/cuotasApi";

export function useCuotas() {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Ver useSocios: re-fetch tras cada mutación,
  // loading solo en la primera carga.
  const primeraCarga = useRef(true);

  const loadCuotas = useCallback(async () => {
    try {
      if (primeraCarga.current) {
        setLoading(true);
      }

      setError(null);

      const data = await cuotasApi.getAll();

      // El listado no muestra cuotas saldadas: el
      // estado se calcula según total/pagados.
      setCuotas(
        data.filter(
          (cuota) =>
            cuota.estado !== "pagada"
        )
      );
    } catch (error) {
      setError(error);
    } finally {
      primeraCarga.current = false;
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

  const deleteCuota = useCallback(
    async (id) => {
      try {
        setError(null);

        await cuotasApi.remove(id);

        await loadCuotas();
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadCuotas]
  );

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