import { usePagos } from "../hooks/usePagos";

export default function PagosPage() {
  const {
    pagos,
    loading,
    error,
  } = usePagos();

  if (loading) {
    return <p>Cargando pagos...</p>;
  }

  return (
    <main>
      <h1>Pagos</h1>

      {error && (
        <p>
          Error: {error.message}
        </p>
      )}

      {pagos.length === 0 ? (
        <p>No hay pagos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cuota</th>
              <th>Fecha</th>
              <th>Importe</th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.id}</td>
                <td>{pago.cuotaId}</td>
                <td>{pago.fecha}</td>
                <td>
                  ${pago.importe}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}