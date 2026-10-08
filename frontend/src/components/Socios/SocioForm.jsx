import { useState } from "react";

const initialForm = {
  dni: "",
  nombre: "",
  apellido: "",
};

export default function SocioForm({
  planes = [],
  onSubmit,
}) {
  const [form, setForm] = useState(initialForm);
  const [telefonos, setTelefonos] = useState([]);
  const [numero, setNumero] = useState("");
  const [planIds, setPlanIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function agregarTelefono(event) {
    event.preventDefault();

    const limpio = numero.trim();

    if (
      !limpio ||
      telefonos.includes(limpio)
    ) {
      return;
    }

    setTelefonos((prev) => [
      ...prev,
      limpio,
    ]);

    setNumero("");
  }

  function quitarTelefono(numeroQuitar) {
    setTelefonos((prev) =>
      prev.filter(
        (item) => item !== numeroQuitar
      )
    );
  }

  function togglePlan(planId) {
    setPlanIds((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError(null);

    try {
      setSaving(true);

      // Un solo POST: el backend crea el socio,
      // sus teléfonos y sus planes en la misma
      // transacción.
      await onSubmit({
        ...form,
        telefonos,
        planIds,
      });

      setForm(initialForm);
      setTelefonos([]);
      setPlanIds([]);
    } catch (error) {
      setError(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p role="alert">
          Error: {error.message}
        </p>
      )}

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

      <fieldset>
        <legend>Teléfonos</legend>

        {telefonos.length === 0 ? (
          <p>Sin teléfonos.</p>
        ) : (
          <ul>
            {telefonos.map((item) => (
              <li key={item}>
                {item}

                <button
                  type="button"
                  onClick={() =>
                    quitarTelefono(item)
                  }
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          value={numero}
          onChange={(event) =>
            setNumero(event.target.value)
          }
          placeholder="Número"
        />

        <button
          type="button"
          onClick={agregarTelefono}
        >
          Agregar teléfono
        </button>
      </fieldset>

      <fieldset>
        <legend>Planes</legend>

        {planes.length === 0 ? (
          <p>No hay planes cargados.</p>
        ) : (
          planes.map((plan) => (
            <label key={plan.id}>
              <input
                type="checkbox"
                checked={planIds.includes(plan.id)}
                onChange={() =>
                  togglePlan(plan.id)
                }
              />

              {plan.nombre} (${plan.valor})
            </label>
          ))
        )}
      </fieldset>

      <button
        type="submit"
        disabled={saving}
      >
        {saving
          ? "Guardando..."
          : "Crear socio"}
      </button>
    </form>
  );
}
