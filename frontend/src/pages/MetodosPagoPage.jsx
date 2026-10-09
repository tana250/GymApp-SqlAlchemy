import { useState } from "react";

import { useMetodosPago } from "../hooks/useMetodosPago";

import MetodosPagoForm from "../components/Pagos/MetodosPagoForm";
import MetodosPagoList from "../components/Pagos/MetodosPagoList";

export default function MetodosPagoPage() {
  const {
    metodos,
    error,
    createMetodo,
    updateMetodo,
    deleteMetodo,
  } = useMetodosPago();

  const [metodoEditando, setMetodoEditando] =
    useState(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  async function handleSubmit(data) {
    try {
      if (metodoEditando) {
        await updateMetodo(
          metodoEditando.id,
          data
        );

        setMetodoEditando(null);
      } else {
        await createMetodo(data);
      }

      setMostrarFormulario(false);
    } catch {
      // El error lo muestra la página.
    }
  }

  function handleEditar(metodo) {
    setMetodoEditando(metodo);
    setMostrarFormulario(true);
  }

  function handleNuevo() {
    setMetodoEditando(null);
    setMostrarFormulario(true);
  }

  function handleCancelar() {
    setMetodoEditando(null);
    setMostrarFormulario(false);
  }

  async function handleToggle(metodo) {
    try {
      await updateMetodo(metodo.id, {
        activo: !metodo.activo,
      });
    } catch {
      // El error lo muestra la página.
    }
  }

  async function handleEliminar(metodo) {
    const confirmar = window.confirm(
      `¿Querés eliminar el método "${metodo.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await deleteMetodo(metodo.id);
    } catch {
      // El error lo muestra la página.
    }
  }

  return (
    <main>
      <h1>Métodos de pago</h1>

      {error && (
        <p role="alert">
          Error: {error.message}
        </p>
      )}

      {!mostrarFormulario && (
        <button
          type="button"
          onClick={handleNuevo}
        >
          Nuevo método
        </button>
      )}

      {mostrarFormulario && (
        <MetodosPagoForm
          metodo={metodoEditando}
          onSubmit={handleSubmit}
          onCancel={handleCancelar}
        />
      )}

      <MetodosPagoList
        metodos={metodos}
        onEdit={handleEditar}
        onToggle={handleToggle}
        onDelete={handleEliminar}
      />
    </main>
  );
}