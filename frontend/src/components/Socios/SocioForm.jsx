import { useEffect, useState } from "react";

const initialForm = {
  dni: "",
  nombre: "",
  apellido: "",
};

export default function SocioForm({
  socio = null,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (socio) {
      setForm({
        dni: socio.dni || "",
        nombre: socio.nombre || "",
        apellido: socio.apellido || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [socio]);

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

      await onSubmit(form);

      if (!socio) {
        setForm(initialForm);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>DNI</label>

        <input
          name="dni"
          value={form.dni}
          onChange={handleChange}
        />
      </div>

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
          : socio
            ? "Guardar cambios"
            : "Crear socio"}
      </button>

      {socio && (
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}