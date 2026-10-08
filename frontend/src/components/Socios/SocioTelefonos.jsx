import { useState } from "react";

export default function SocioTelefonos({
  socio,
  telefonos,
  onAdd,
  onRemove,
}) {
  const [numero, setNumero] = useState("");
  const [saving, setSaving] = useState(false);

  const telefonosSocio = telefonos.filter(
    (telefono) =>
      telefono.socioId === socio.id
  );

  async function handleAdd(event) {
    event.preventDefault();

    if (!numero.trim()) {
      return;
    }

    try {
      setSaving(true);

      await onAdd({
        socioId: socio.id,
        numero: numero.trim(),
      });

      setNumero("");
    } catch {
      // El hook ya guardó el error.
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h3>Teléfonos</h3>

      <ul>
        {telefonosSocio.map((telefono) => (
          <li
            key={`${telefono.socioId}-${telefono.numero}`}
          >
            {telefono.numero}

            <button
              type="button"
              onClick={() => {
                onRemove(
                  telefono.socioId,
                  telefono.numero
                ).catch(() => {
                  // El hook ya guardó el error.
                });
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd}>
        <input
          value={numero}
          onChange={(event) =>
            setNumero(event.target.value)
          }
          placeholder="Número"
        />

        <button
          type="submit"
          disabled={saving}
        >
          Agregar
        </button>
      </form>
    </section>
  );
}