import { useState } from "react";

export default function GenerarCuotasForm({
  generating,
  onGenerate,
}) {
  const ahora = new Date();

  const [año, setAño] =
    useState(ahora.getFullYear());

  const [mes, setMes] =
    useState(ahora.getMonth() + 1);

  const [resultado, setResultado] =
    useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const result = await onGenerate(
      Number(año),
      Number(mes)
    );

    setResultado(result);
  }

  return (
    <section>
      <h2>Generar cuotas</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Año</label>

          <input
            type="number"
            value={año}
            onChange={(event) =>
              setAño(event.target.value)
            }
          />
        </div>

        <div>
          <label>Mes</label>

          <select
            value={mes}
            onChange={(event) =>
              setMes(event.target.value)
            }
          >
            {Array.from(
              { length: 12 },
              (_, index) => (
                <option
                  key={index + 1}
                  value={index + 1}
                >
                  {index + 1}
                </option>
              )
            )}
          </select>
        </div>

        <button
          type="submit"
          disabled={generating}
        >
          {generating
            ? "Generando..."
            : "Generar cuotas"}
        </button>
      </form>

      {resultado && (
        <p>
          Se generaron{" "}
          <strong>
            {resultado.cantidad}
          </strong>{" "}
          cuotas.
        </p>
      )}
    </section>
  );
}