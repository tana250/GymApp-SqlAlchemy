export default function PlanList({
  planes,
  onEdit,
  onDelete,
}) {
  if (!planes.length) {
    return <p>No hay planes.</p>;
  }

  return (
    <div>
      {planes.map((plan) => (
        <article key={plan.id}>
          <h3>{plan.nombre}</h3>

          <p>
            {plan.descripcion ||
              "Sin descripción"}
          </p>

          <p>
            Valor: ${plan.valor}
          </p>

          <button
            type="button"
            onClick={() => onEdit(plan)}
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(plan.id)
            }
          >
            Eliminar
          </button>
        </article>
      ))}
    </div>
  );
}