export default function SocioList({
  socios,
  onEdit,
  onDelete,
  onSelect,
}) {
  if (!socios.length) {
    return <p>No hay socios registrados.</p>;
  }

  return (
    <div>
      {socios.map((socio) => (
        <article key={socio.id}>
          <h3>
            {socio.nombre} {socio.apellido}
          </h3>

          <p>
            DNI: {socio.dni || "Sin DNI"}
          </p>

          <button
            type="button"
            onClick={() => onSelect(socio)}
          >
            Ver
          </button>

          <button
            type="button"
            onClick={() => onEdit(socio)}
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => onDelete(socio.id)}
          >
            Eliminar
          </button>
        </article>
      ))}
    </div>
  );
}