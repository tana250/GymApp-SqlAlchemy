import { useCallback, useEffect, useRef, useState } from "react";
import metodosPagoApi from "../services/metodosPagoApi";

export function useMetodosPago() {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ver useSocios: re-fetch tras cada mutación,
  // loading solo en la primera carga.
  const primeraCarga = useRef(true);

  const loadMetodos = useCallback(async () => {
    try {
      if (primeraCarga.current) {
        setLoading(true);
      }

      setError(null);

      const data = await metodosPagoApi.getAll();

      setMetodos(data);
    } catch (error) {
      setError(error);
    } finally {
      primeraCarga.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetodos();
  }, [loadMetodos]);

  const getMetodo = useCallback(async (id) => {
    return metodosPagoApi.getById(id);
  }, []);

  const createMetodo = useCallback(
    async (metodo) => {
      try {
        setError(null);

        const nuevoMetodo = await metodosPagoApi.insert(metodo);

        await loadMetodos();

        return nuevoMetodo;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadMetodos]
  );

  const updateMetodo = useCallback(
    async (id, metodo) => {
      try {
        setError(null);

        const metodoActualizado = await metodosPagoApi.update(
          id,
          metodo
        );

        await loadMetodos();

        return metodoActualizado;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadMetodos]
  );

  const deleteMetodo = useCallback(
    async (id) => {
      try {
        setError(null);

        await metodosPagoApi.remove(id);

        await loadMetodos();
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadMetodos]
  );

  return {
    metodos,
    loading,
    error,

    loadMetodos,
    getMetodo,

    createMetodo,
    updateMetodo,
    deleteMetodo,
  };
}