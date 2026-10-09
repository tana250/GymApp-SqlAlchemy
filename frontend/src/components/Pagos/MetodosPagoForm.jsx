import { useEffect, useState } from "react";

const initialForm = {
  nombre: "",
  descripcion: "",
};

export default function MetodosPagoForm({
  metodo = null,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (metodo) {
      setForm({
        nombre: metodo.nombre || "",
        descripcion: metodo.descripcion || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [metodo]);

  function handleChange(event) {
    const { name, value } = event.target;

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
        descripcion:
          form.descripcion.trim() || undefined,
      });

      if (!metodo) {
        setForm(initialForm);
      }
    } catch {
      // El error lo muestra PagosPage.
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

      <button
        type="submit"
        disabled={saving}
      >
        {saving
          ? "Guardando..."
          : metodo
            ? "Guardar cambios"
            : "Crear método"}
      </button>

      {metodo && (
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