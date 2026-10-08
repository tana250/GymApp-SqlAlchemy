import { useState } from "react";

export default function PagoForm({
  cuota,
  onSubmit,
}) {
  const [importe, setImporte] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!importe) {
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        cuotaId: cuota.id,
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

      <input
        type="number"
        min="1"
        max={cuota.saldo}
        value={importe}
        onChange={(event) =>
          setImporte(event.target.value)
        }
        required
      />

      <button
        type="submit"
        disabled={
          saving ||
          cuota.saldo <= 0
        }
      >
        {saving
          ? "Registrando..."
          : "Registrar pago"}
      </button>
    </form>
  );
}