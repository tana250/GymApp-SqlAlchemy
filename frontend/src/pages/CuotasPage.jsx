import { useState } from "react";

import { useCuotas } from "../hooks/useCuotas";
import { usePagos } from "../hooks/usePagos";

import GenerarCuotasForm from "../components/Cuotas/GenerarCuotasForm";
import CuotaList from "../components/Cuotas/CuotaList";
import CuotaDetalle from "../components/Cuotas/CuotasDetalle";

export default function CuotasPage() {
  const {
    cuotas,
    loading,
    generating,
    error,
    generarCuotas,
    getCuota,
  } = useCuotas();

  const {
    createPago,
  } = usePagos();

  const [cuotaSeleccionada, setCuotaSeleccionada] =
    useState(null);

  async function handleSelect(cuota) {
    const detalle =
      await getCuota(cuota.id);

    setCuotaSeleccionada(detalle);
  }

  async function handlePago(pago) {
    await createPago(pago);

    // Volver a cargar la cuota para obtener
    // total, pagado, saldo y pagos actualizados.
    if (cuotaSeleccionada) {
      const actualizada =
        await getCuota(
          cuotaSeleccionada.id
        );

      setCuotaSeleccionada(actualizada);
    }
  }

  if (loading) {
    return <p>Cargando cuotas...</p>;
  }

  return (
    <main>
      <h1>Cuotas</h1>

      {error && (
        <p>
          Error: {error.message}
        </p>
      )}

      <GenerarCuotasForm
        generating={generating}
        onGenerate={generarCuotas}
      />

      <section>
        <h2>Cuotas</h2>

        <CuotaList
          cuotas={cuotas}
          onSelect={handleSelect}
        />
      </section>

      {cuotaSeleccionada && (
        <CuotaDetalle
          cuota={cuotaSeleccionada}
          onClose={() =>
            setCuotaSeleccionada(null)
          }
          onPago={handlePago}
        />
      )}
    </main>
  );
}