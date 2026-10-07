import { useEffect, useState } from "react";

const initialForm = {
  nombre: "",
  descripcion: "",
  valor: "",
};

export default function PlanForm({
  plan = null,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] =
    useState(initialForm);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        nombre: plan.nombre || "",
        descripcion: plan.descripcion || "",
        valor: plan.valor ?? "",
      });
    } else {
      setForm(initialForm);
    }
  }, [plan]);

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      await onSubmit({
        ...form,
        valor: Number(form.valor),
      });

      if (!plan) {
        setForm(initialForm);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre</label>

        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Descripción</label>

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Valor</label>

        <input
          type="number"
          min="0"
          name="valor"
          value={form.valor}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={saving}
      >
        {saving
          ? "Guardando..."
          : plan
            ? "Guardar cambios"
            : "Crear plan"}
      </button>

      {plan && (
        <button
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}