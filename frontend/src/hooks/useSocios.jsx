import { useCallback, useEffect, useRef, useState } from "react";
import sociosApi from "../services/sociosApi";

export function useSocios() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Las mutaciones siempre vuelven a pedir la lista
  // al backend (el estado local se desincroniza:
  // to_json trae relations anidadas, etc.).
  // Solo la primera carga muestra el loading de
  // pantalla completa.
  const primeraCarga = useRef(true);

  const loadSocios = useCallback(async () => {
    try {
      if (primeraCarga.current) {
        setLoading(true);
      }

      setError(null);

      const data = await sociosApi.getAll();

      setSocios(data);
    } catch (error) {
      setError(error);
    } finally {
      primeraCarga.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSocios();
  }, [loadSocios]);

  const getSocio = useCallback(async (id) => {
    return sociosApi.getById(id);
  }, []);

  const createSocio = useCallback(
    async (socio) => {
      try {
        setError(null);

        const nuevoSocio = await sociosApi.insert(socio);

        await loadSocios();

        return nuevoSocio;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadSocios]
  );

  const updateSocio = useCallback(
    async (id, socio) => {
      try {
        setError(null);

        const socioActualizado = await sociosApi.update(
          id,
          socio
        );

        await loadSocios();

        return socioActualizado;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadSocios]
  );

  const deleteSocio = useCallback(
    async (id) => {
      try {
        setError(null);

        await sociosApi.remove(id);

        await loadSocios();
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    [loadSocios]
  );

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
