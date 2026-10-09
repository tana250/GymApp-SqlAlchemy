import { useEffect, useState } from "react";

import PagoForm from "./PagoForm";

export default function PagarCuotaForm({
  socios,
  cuotas,
  metodos,
  onPago,
}) {
  const [query, setQuery] = useState("");
  const [socioId, setSocioId] = useState("");
  const [cuotaId, setCuotaId] = useState("");

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const metodosActivos = metodos.filter(
    (metodo) => metodo.activo
  );

  const sociosFiltrados = query.trim()
    ? socios.filter(
        (socio) =>
          socio.dni &&
          socio.dni.includes(query.trim())
      )
    : socios;

  const cuotasSocio = socioId
    ? cuotas.filter(
        (cuota) =>
          cuota.socioId === Number(socioId)
      )
    : [];

  const cuotaSeleccionada = cuotas.find(
    (cuota) => cuota.id === Number(cuotaId)
  );

  // Si la cuota elegida ya no está en la lista
  // (por ejemplo quedó pagada), resetear el select.
  useEffect(() => {
    if (cuotaId && !cuotaSeleccionada) {
      setCuotaId("");
    }
  }, [cuotaId, cuotaSeleccionada]);

  function handleQueryChange(event) {
    setQuery(event.target.value);
    setSocioId("");
    setCuotaId("");
    setMensaje(null);
  }

  function handleSocioChange(event) {
    setSocioId(event.target.value);
    setCuotaId("");
    setMensaje(null);
  }

  function handleCuotaChange(event) {
    setCuotaId(event.target.value);
    setMensaje(null);
  }

  async function handlePago(pago) {
    try {
      setError(null);

      await onPago(pago);

      setMensaje("Pago registrado.");
    } catch (error) {
      setError(error);
      setMensaje(null);

      // PagoForm termina su estado de guardado.
      throw error;
    }
  }

  return (
    <section>
      <h2>Cobrar cuota</h2>

      {mensaje && <p>{mensaje}</p>}

      {error && (
        <p role="alert">
          Error: {error.message}
        </p>
      )}

      <div>
        <label>Buscar por DNI</label>

        <input
          value={query}
          onChange={handleQueryChange}
          placeholder="DNI del socio"
        />
      </div>

      <div>
        <label>Socio</label>

        <select
          value={socioId}
          onChange={handleSocioChange}
        >
          <option value="">
            {sociosFiltrados.length
              ? "Seleccionar socio"
              : "Sin resultados"}
          </option>

          {sociosFiltrados.map((socio) => (
            <option
              key={socio.id}
              value={socio.id}
            >
              {socio.dni || "Sin DNI"} —{" "}
              {socio.apellido},{" "}
              {socio.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Cuota</label>

        <select
          value={cuotaId}
          onChange={handleCuotaChange}
          disabled={!socioId}
        >
          <option value="">
            {cuotasSocio.length
              ? "Seleccionar cuota"
              : socioId
                ? "Sin cuotas pendientes"
                : "Primero seleccionar socio"}
          </option>

          {cuotasSocio.map((cuota) => (
            <option
              key={cuota.id}
              value={cuota.id}
            >
              {cuota.mes}/{cuota.año} — saldo: $
              {cuota.saldo}
            </option>
          ))}
        </select>
      </div>

      {cuotaSeleccionada && (
        <PagoForm
          key={cuotaSeleccionada.id}
          cuota={cuotaSeleccionada}
          metodos={metodosActivos}
          onSubmit={handlePago}
        />
      )}
    </section>
  );
}