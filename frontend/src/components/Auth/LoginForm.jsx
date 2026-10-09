import { useState } from "react";

export default function LoginForm({
  onLogin,
}) {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!username || !password) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onLogin(username, password);
    } catch (error) {
      setError(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>

      {error && (
        <p role="alert">
          Error: {error.message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>

          <input
            value={username}
            onChange={(event) =>
              setUsername(
                event.target.value
              )
            }
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Ingresando..."
            : "Ingresar"}
        </button>
      </form>
    </main>
  );
}