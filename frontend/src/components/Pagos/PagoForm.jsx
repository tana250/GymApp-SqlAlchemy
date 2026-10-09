import { useState } from "react";

export default function PagoForm({
  cuota,
  metodos,
  onSubmit,
}) {
  const [importe, setImporte] =
    useState("");

  // Solo se puede pagar con métodos activos.
  const metodosActivos = metodos.filter(
    (metodo) => metodo.activo
  );

  const [metodoPagoId, setMetodoPagoId] =
    useState(
      metodosActivos[0]?.id ?? ""
    );

  const [saving, setSaving] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!importe || !metodoPagoId) {
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        cuotaId: cuota.id,
        metodoPagoId,
        fecha: new Date()
          .toISOString()
          .split("T")[0],
        importe: Number(importe),
      });

      setImporte("");
    } catch {
      // El error lo muestra CuotasPage.
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar pago</h3>

      <p>
        Saldo pendiente: ${cuota.saldo}
      </p>

      <div>
        <label>Método de pago</label>

        <select
          value={metodoPagoId}
          onChange={(event) =>
            setMetodoPagoId(
              Number(event.target.value)
            )
          }
          required
        >
          {metodosActivos.length === 0 && (
            <option value="">
              No hay métodos activos
            </option>
          )}

          {metodosActivos.map((metodo) => (
            <option
              key={metodo.id}
              value={metodo.id}
            >
              {metodo.nombre}
              {metodo.descripcion
                ? ` — ${metodo.descripcion}`
                : ""}
            </option>
          ))}
        </select>
      </div>

      <input
        type="number"
        min="1"
        max={cuota.saldo}
        value={importe}
        onChange={(event) =>
          setImporte(event.target.value)
        }
        placeholder="Importe"
        required
      />

      <button
        type="submit"
        disabled={
          saving ||
          cuota.saldo <= 0 ||
          metodosActivos.length === 0
        }
      >
        {saving
          ? "Registrando..."
          : "Registrar pago"}
      </button>
    </form>
  );
}