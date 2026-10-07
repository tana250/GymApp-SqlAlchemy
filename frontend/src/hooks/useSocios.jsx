import { useCallback, useEffect, useState } from "react";
import sociosApi from "../services/sociosApi";

export function useSocios() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSocios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await sociosApi.getAll();

      setSocios(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSocios();
  }, [loadSocios]);

  const getSocio = useCallback(async (id) => {
    return sociosApi.getById(id);
  }, []);

  const createSocio = useCallback(async (socio) => {
    const nuevoSocio = await sociosApi.insert(socio);

    setSocios((prev) => [
      ...prev,
      nuevoSocio,
    ]);

    return nuevoSocio;
  }, []);

  const updateSocio = useCallback(async (id, socio) => {
    const socioActualizado = await sociosApi.update(
      id,
      socio
    );

    setSocios((prev) =>
      prev.map((item) =>
        item.id === id
          ? socioActualizado
          : item
      )
    );

    return socioActualizado;
  }, []);

  const deleteSocio = useCallback(async (id) => {
    await sociosApi.remove(id);

    setSocios((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }, []);

  return {
    socios,
    loading,
    error,

    loadSocios,
    getSocio,

    createSocio,
    updateSocio,
    deleteSocio,
  };
}