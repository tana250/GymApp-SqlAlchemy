export default function SocioList({
  socios,
  onEdit,
  onPlanes,
  onToggleActivo,
}) {
  if (!socios.length) {
    return <p>No hay socios registrados.</p>;
  }

  return (
    <div>
      {socios.map((socio) => (
        <article key={socio.id}>
          <h3>
            {socio.dni || "Sin DNI"} —{" "}
            {socio.nombre} {socio.apellido}
            {!socio.activo && " (Baja)"}
          </h3>

          <button
            type="button"
            onClick={() => onEdit(socio)}
          >
            Modificar
          </button>

          <button
            type="button"
            onClick={() => onPlanes(socio)}
          >
            Planes
          </button>

          <button
            type="button"
            onClick={() => onToggleActivo(socio)}
          >
            {socio.activo
              ? "Dar de baja"
              : "Reactivar"}
          </button>
        </article>
      ))}
    </div>
  );
}
