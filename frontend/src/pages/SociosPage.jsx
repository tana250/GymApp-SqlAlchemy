import { useState } from "react";

import { useSocios } from "../hooks/useSocios";
import usePlanes from "../hooks/usePlanes";
import { useSocioPlanes } from "../hooks/useSocioPlanes";
import { useTelefonos } from "../hooks/useTelefonos";

import SocioForm from "../components/Socios/SocioForm";
import SocioList from "../components/Socios/SocioList";
import SocioPlanes from "../components/Socios/SocioPlanes";
import SocioTelefonos from "../components/Socios/SocioTelefonos";

export default function SociosPage() {
  const {
    socios,
    loading,
    error,
    createSocio,
    updateSocio,
    deleteSocio,
  } = useSocios();

  const {
    planes,
  } = usePlanes();

  const {
    socioPlanes,
    assignPlan,
    removePlan,
  } = useSocioPlanes();

  const {
    telefonos,
    createTelefono,
    deleteTelefono,
  } = useTelefonos();

  const [socioEditando, setSocioEditando] =
    useState(null);

  const [socioSeleccionado, setSocioSeleccionado] =
    useState(null);

  async function handleSubmit(data) {
    if (socioEditando) {
      await updateSocio(
        socioEditando.id,
        data
      );

      setSocioEditando(null);
    } else {
      await createSocio(data);
    }
  }

  async function handleDelete(id) {
    const confirmar = window.confirm(
      "¿Eliminar este socio?"
    );

    if (!confirmar) {
      return;
    }

    await deleteSocio(id);

    if (
      socioSeleccionado?.id === id
    ) {
      setSocioSeleccionado(null);
    }
  }

  if (loading) {
    return <p>Cargando socios...</p>;
  }

  return (
    <main>
      <h1>Socios</h1>

      {error && (
        <p>
          Error: {error.message}
        </p>
      )}

      <section>
        <h2>
          {socioEditando
            ? "Editar socio"
            : "Nuevo socio"}
        </h2>

        <SocioForm
          socio={socioEditando}
          onSubmit={handleSubmit}
          onCancel={() =>
            setSocioEditando(null)
          }
        />
      </section>

      <section>
        <h2>Listado</h2>

        <SocioList
          socios={socios}
          onEdit={setSocioEditando}
          onDelete={handleDelete}
          onSelect={setSocioSeleccionado}
        />
      </section>

      {socioSeleccionado && (
        <section>
          <h2>
            {socioSeleccionado.nombre}{" "}
            {socioSeleccionado.apellido}
          </h2>

          <SocioPlanes
            socio={socioSeleccionado}
            planes={planes}
            socioPlanes={socioPlanes}
            onAssign={assignPlan}
            onRemove={removePlan}
          />

          <SocioTelefonos
            socio={socioSeleccionado}
            telefonos={telefonos}
            onAdd={createTelefono}
            onRemove={deleteTelefono}
          />

          <button
            type="button"
            onClick={() =>
              setSocioSeleccionado(null)
            }
          >
            Cerrar
          </button>
        </section>
      )}
    </main>
  );
}