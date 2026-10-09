export default function CuotaDetalle({
  cuota,
  onClose,
}) {
  return (
    <section>
      <h2>
        Cuota {cuota.mes}/{cuota.año}
      </h2>

      <p>
        Total: ${cuota.total}
      </p>

      <p>
        Pagado: ${cuota.pagado}
      </p>

      <p>
        Saldo: ${cuota.saldo}
      </p>

      <p>
        Estado: {cuota.estado}
      </p>

      <h3>Planes</h3>

      <ul>
        {cuota.planes.map((plan) => (
          <li key={plan.id}>
            Plan #{plan.planId}: $
            {plan.precio}
          </li>
        ))}
      </ul>

      <h3>Pagos</h3>

      {cuota.pagos.length === 0 ? (
        <p>No hay pagos.</p>
      ) : (
        <ul>
          {cuota.pagos.map((pago) => (
            <li key={pago.id}>
              {pago.fecha}: $
              {pago.importe}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onClose}
      >
        Cerrar
      </button>
    </section>
  );
}