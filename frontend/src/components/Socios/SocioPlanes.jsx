import { useMemo } from "react";

export default function SocioPlanes({
  socio,
  planes,
  socioPlanes,
  onAssign,
  onRemove,
}) {
  const planesDelSocio = useMemo(() => {
    return socioPlanes.filter(
      (item) => item.socioId === socio.id
    );
  }, [socioPlanes, socio.id]);

  const idsAsignados = new Set(
    planesDelSocio.map(
      (item) => item.planId
    )
  );

  const planesDisponibles = planes.filter(
    (plan) => !idsAsignados.has(plan.id)
  );

  return (
    <section>
      <h3>Planes</h3>

      {planesDelSocio.length === 0 ? (
        <p>El socio no tiene planes.</p>
      ) : (
        <ul>
          {planesDelSocio.map((socioPlan) => {
            const plan = planes.find(
              (item) =>
                item.id === socioPlan.planId
            );

            return (
              <li key={socioPlan.planId}>
                {plan?.nombre || "Plan"}

                <button
                  type="button"
                  onClick={() =>
                    onRemove(
                      socio.id,
                      socioPlan.planId
                    )
                  }
                >
                  Quitar
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {planesDisponibles.length > 0 && (
        <div>
          <h4>Agregar plan</h4>

          {planesDisponibles.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() =>
                onAssign(
                  socio.id,
                  plan.id
                )
              }
            >
              + {plan.nombre}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
