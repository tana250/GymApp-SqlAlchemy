import { useState } from "react";

import usePlanes from "../hooks/usePlanes";

import PlanForm from "../components/Planes/PlanForm";
import PlanList from "../components/Planes/PlanList";

export default function PlanesPage() {
  const {
    planes,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
  } = usePlanes();

  const [planEditando, setPlanEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  async function handleSubmit(data) {
    try {
      if (planEditando) {
        await updatePlan(planEditando.id, data);

        setPlanEditando(null);
      } else {
        await createPlan(data);
      }

      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditar(plan) {
    setPlanEditando(plan);
    setMostrarFormulario(true);
  }

  function handleNuevo() {
    setPlanEditando(null);
    setMostrarFormulario(true);
  }

  function handleCancelar() {
    setPlanEditando(null);
    setMostrarFormulario(false);
  }

  async function handleEliminar(plan) {
    const confirmar = window.confirm(
      `¿Querés eliminar el plan "${plan.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await deletePlan(plan.id);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <section>
        <h1>Planes</h1>
        <p>Cargando planes...</p>
      </section>
    );
  }

  return (
    <section>
      <header>
        <h1>Planes</h1>

        {!mostrarFormulario && (
          <button onClick={handleNuevo}>
            Nuevo plan
          </button>
        )}
      </header>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {mostrarFormulario && (
        <PlanForm
          plan={planEditando}
          onSubmit={handleSubmit}
          onCancel={handleCancelar}
        />
      )}

      <PlanList
        planes={planes}
        onEdit={handleEditar}
        onDelete={handleEliminar}
      />
    </section>
  );
}