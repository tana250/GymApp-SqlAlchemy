export default function CuotaCard({
  cuota,
  onSelect,
}) {
  return (
    <article>
      <h3>
        {cuota.mes}/{cuota.año}
      </h3>

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

      <button
        type="button"
        onClick={() => onSelect(cuota)}
      >
        Ver detalle
      </button>
    </article>
  );
}