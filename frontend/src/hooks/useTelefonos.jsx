import { useCallback, useEffect, useState } from "react";
import telefonosApi from "../services/telefonosApi";

export function useTelefonos(socioId = null) {
  const [telefonos, setTelefonos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTelefonos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await telefonosApi.getAll();

      const resultado =
        socioId !== null
          ? data.filter(
              (telefono) =>
                Number(telefono.socioId) ===
                Number(socioId)
            )
          : data;

      setTelefonos(resultado);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [socioId]);

  useEffect(() => {
    loadTelefonos();
  }, [loadTelefonos]);

  const createTelefono = useCallback(
    async (telefono) => {
      try {
        setError(null);

        await telefonosApi.insert(telefono);

        await loadTelefonos();
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadTelefonos]
  );

  const deleteTelefono = useCallback(
    async (socioId, numero) => {
      try {
        setError(null);

        await telefonosApi.remove(
          socioId,
          numero
        );

        await loadTelefonos();
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadTelefonos]
  );

  return {
    telefonos,
    loading,
    error,
    loadTelefonos,
    createTelefono,
    deleteTelefono,
  };
}