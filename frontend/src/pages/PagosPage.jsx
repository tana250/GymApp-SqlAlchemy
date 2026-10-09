import { usePagos } from "../hooks/usePagos";
import { useSocios } from "../hooks/useSocios";
import { useCuotas } from "../hooks/useCuotas";
import { useMetodosPago } from "../hooks/useMetodosPago";

import PagarCuotaForm from "../components/Pagos/PagarCuotaForm";

export default function PagosPage() {
  const {
    pagos,
    loading,
    error,
    loadPagos,
    deletePago,
    createPago,
  } = usePagos();

  const { socios } = useSocios();

  const {
    cuotas,
    loadCuotas,
  } = useCuotas();

  const { metodos } = useMetodosPago();

  const totalCobrado = pagos.reduce(
    (total, pago) => total + pago.importe,
    0
  );

  async function handlePagar(pago) {
    await createPago(pago);

    // La cuota recién saldada sale del listado y de
    // la búsqueda; las parciales actualizan su saldo.
    await loadCuotas();
  }

  async function handleEliminarPago(pago) {
    const confirmar = window.confirm(
      `¿Querés eliminar el pago de $${pago.importe}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await deletePago(pago.id);
    } catch {
      // El error lo muestra la página.
    }
  }

  if (loading) {
    return <p>Cargando pagos...</p>;
  }

  return (
    <main>
      <h1>Pagos</h1>

      {error && (
        <p role="alert">
          Error: {error.message}
        </p>
      )}

      <PagarCuotaForm
        socios={socios}
        cuotas={cuotas}
        metodos={metodos}
        onPago={handlePagar}
      />

      <section>
        <header>
          <h2>Cobros</h2>

          <button
            type="button"
            onClick={loadPagos}
          >
            Recargar
          </button>
        </header>

        <p>Total cobrado: ${totalCobrado}</p>

        {pagos.length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Socio</th>
                <th>Período</th>
                <th>Cuota</th>
                <th>Método</th>
                <th>Importe</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.fecha}</td>

                  <td>
                    {pago.socio
                      ? `${pago.socio.apellido}, ${pago.socio.nombre}`
                      : pago.cuotaId}
                  </td>

                  <td>
                    {pago.periodo
                      ? `${pago.periodo.mes}/${pago.periodo.año}`
                      : "-"}
                  </td>

                  <td>{pago.cuotaId}</td>

                  <td>
                    {pago.metodoPago?.nombre ||
                      pago.metodoPagoId}
                  </td>

                  <td>${pago.importe}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        handleEliminarPago(pago)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}