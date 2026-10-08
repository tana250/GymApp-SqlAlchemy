import { useState } from "react";

import SocioTelefonos from "./SocioTelefonos";

export default function SocioEditForm({
  socio,
  telefonos,
  onAddTelefono,
  onRemoveTelefono,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    nombre: socio.nombre || "",
    apellido: socio.apellido || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError(null);

    try {
      setSaving(true);

      await onSubmit(form);
    } catch (error) {
      setError(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {error && (
        <p role="alert">
          Error: {error.message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <p>
          DNI: {socio.dni || "Sin DNI"}
        </p>

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
          <label>Apellido</label>

          <input
            name="apellido"
            value={form.apellido}
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
            : "Guardar cambios"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>
      </form>

      <SocioTelefonos
        socio={socio}
        telefonos={telefonos}
        onAdd={onAddTelefono}
        onRemove={onRemoveTelefono}
      />
    </>
  );
}
