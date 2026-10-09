export default function MetodosPagoList({
  metodos,
  onEdit,
  onToggle,
  onDelete,
}) {
  if (!metodos.length) {
    return <p>No hay métodos de pago.</p>;
  }

  return (
    <div>
      {metodos.map((metodo) => (
        <article key={metodo.id}>
          <h4>
            {metodo.nombre}
            {!metodo.activo && " (inactivo)"}
          </h4>

          <p>
            {metodo.descripcion ||
              "Sin descripción"}
          </p>

          <button
            type="button"
            onClick={() => onEdit(metodo)}
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => onToggle(metodo)}
          >
            {metodo.activo
              ? "Desactivar"
              : "Activar"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(metodo)}
          >
            Eliminar
          </button>
        </article>
      ))}
    </div>
  );
}