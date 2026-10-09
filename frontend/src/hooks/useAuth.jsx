import { useCallback, useEffect, useState } from "react";
import authApi from "../services/authApi";

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

  // Al montar la app se consulta /auth/me para
  // saber si ya hay sesión (cookie) o no.
  useEffect(() => {
    async function check() {
      try {
        setError(null);

        const usuario = await authApi.me();

        setUsuario(usuario);
      } catch {
        // Sin sesión o expirada: se muestra el login.
        setUsuario(null);
      } finally {
        setChecking(false);
      }
    }

    check();
  }, []);

  const login = useCallback(
    async (username, password) => {
      try {
        setError(null);

        const usuario = await authApi.login(
          username,
          password
        );

        setUsuario(usuario);

        return usuario;
      } catch (error) {
        setError(error);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setError(null);

      await authApi.logout();
    } catch {
      // Aunque falle el logout, se vuelve al login.
    } finally {
      setUsuario(null);
    }
  }, []);

  return {
    usuario,
    checking,
    error,

    login,
    logout,
  };
}