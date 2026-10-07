import { useCallback, useEffect, useState } from "react";
import pagosApi from "../services/pagosApi";

export function usePagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPagos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await pagosApi.getAll();

      setPagos(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPagos();
  }, [loadPagos]);

  const getPago = useCallback(async (id) => {
    return pagosApi.getById(id);
  }, []);

  const createPago = useCallback(async (pago) => {
    const nuevoPago = await pagosApi.insert(pago);

    setPagos((prev) => [
      ...prev,
      nuevoPago,
    ]);

    return nuevoPago;
  }, []);

  const updatePago = useCallback(async (id, pago) => {
    const pagoActualizado = await pagosApi.update(
      id,
      pago
    );

    setPagos((prev) =>
      prev.map((item) =>
        item.id === id
          ? pagoActualizado
          : item
      )
    );

    return pagoActualizado;
  }, []);

  const deletePago = useCallback(async (id) => {
    await pagosApi.remove(id);

    setPagos((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }, []);

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