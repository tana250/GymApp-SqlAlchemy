import { useCallback, useEffect, useRef, useState } from "react";
import pagosApi from "../services/pagosApi";

export function usePagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ver useSocios: re-fetch tras cada mutación,
  // loading solo en la primera carga.
  const primeraCarga = useRef(true);

  const loadPagos = useCallback(async () => {
    try {
      if (primeraCarga.current) {
        setLoading(true);
      }

      setError(null);

      const data = await pagosApi.getAll();

      setPagos(data);
    } catch (error) {
      setError(error);
    } finally {
      primeraCarga.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPagos();
  }, [loadPagos]);

  const getPago = useCallback(async (id) => {
    return pagosApi.getById(id);
  }, []);

  const createPago = useCallback(
    async (pago) => {
      try {
        setError(null);

        const nuevoPago = await pagosApi.insert(pago);

        await loadPagos();

        return nuevoPago;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadPagos]
  );

  const updatePago = useCallback(
    async (id, pago) => {
      try {
        setError(null);

        const pagoActualizado = await pagosApi.update(id, pago);

        await loadPagos();

        return pagoActualizado;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadPagos]
  );

  const deletePago = useCallback(
    async (id) => {
      try {
        setError(null);

        await pagosApi.remove(id);

        await loadPagos();
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadPagos]
  );

  return {
    pagos,
    loading,
    error,

    loadPagos,
    getPago,

    createPago,
    updatePago,
    deletePago,
  };
}
