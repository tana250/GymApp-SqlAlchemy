import { useState } from "react";

import { useSocios } from "../hooks/useSocios";
import usePlanes from "../hooks/usePlanes";
import { useSocioPlanes } from "../hooks/useSocioPlanes";
import { useTelefonos } from "../hooks/useTelefonos";

import SocioForm from "../components/Socios/SocioForm";
import SocioList from "../components/Socios/SocioList";
import SocioPlanes from "../components/Socios/SocioPlanes";
import SocioEditForm from "../components/Socios/SocioEditForm";
import Modal from "../components/Socios/Modal";

export default function SociosPage() {
  const {
    socios,
    loading,
    error,
    createSocio,
    updateSocio,
  } = useSocios();

  const {
    planes,
  } = usePlanes();

  const {
    socioPlanes,
    loading: loadingSocioPlanes,
    error: socioPlanesError,
    assignPlan,
    removePlan,
  } = useSocioPlanes();

  const {
    telefonos,
    error: telefonosError,
    createTelefono,
    deleteTelefono,
    loadTelefonos,
  } = useTelefonos();

  // { tipo: "editar" | "planes", socioId }
  const [modal, setModal] = useState(null);

  // El socio se deriva de la lista para no
  // quedarnos con un snapshot viejo.
  const socioSeleccionado = modal
    ? socios.find(
        (socio) => socio.id === modal.socioId
      ) ?? null
    : null;

  async function handleCreate(data) {
    await createSocio(data);

    // Socio.to_json no incluye teléfonos:
    // hace falta refrescar la lista.
    await loadTelefonos();
  }

  async function handleEdit(data) {
    await updateSocio(modal.socioId, data);

    setModal(null);
  }

  async function handleToggleActivo(socio) {
    const accion = socio.activo
      ? "Dar de baja"
      : "Reactivar";

    const confirmar = window.confirm(
      `¿${accion} a ${socio.nombre} ${socio.apellido}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await updateSocio(socio.id, {
        activo: !socio.activo,
      });
    } catch {
      // El hook ya guardó el error.
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
        <h2>Nuevo socio</h2>

        <SocioForm
          planes={planes}
          onSubmit={handleCreate}
        />
      </section>

      <section>
        <h2>Listado</h2>

        <SocioList
          socios={socios}
          onEdit={(socio) =>
            setModal({
              tipo: "editar",
              socioId: socio.id,
            })
          }
          onPlanes={(socio) =>
            setModal({
              tipo: "planes",
              socioId: socio.id,
            })
          }
          onToggleActivo={handleToggleActivo}
        />
      </section>

      {modal?.tipo === "editar" &&
        socioSeleccionado && (
          <Modal
            titulo={`Modificar ${socioSeleccionado.nombre} ${socioSeleccionado.apellido}`}
            onClose={() => setModal(null)}
          >
            {telefonosError && (
              <p>
                Error: {telefonosError.message}
              </p>
            )}

            <SocioEditForm
              key={socioSeleccionado.id}
              socio={socioSeleccionado}
              telefonos={telefonos}
              onAddTelefono={createTelefono}
              onRemoveTelefono={deleteTelefono}
              onSubmit={handleEdit}
              onCancel={() => setModal(null)}
            />
          </Modal>
        )}

      {modal?.tipo === "planes" &&
        socioSeleccionado && (
          <Modal
            titulo={`Planes de ${socioSeleccionado.nombre} ${socioSeleccionado.apellido}`}
            onClose={() => setModal(null)}
          >
            {socioPlanesError && (
              <p>
                Error: {socioPlanesError.message}
              </p>
            )}

            {loadingSocioPlanes ? (
              <p>Cargando planes...</p>
            ) : (
              <SocioPlanes
                socio={socioSeleccionado}
                planes={planes}
                socioPlanes={socioPlanes}
                onAssign={assignPlan}
                onRemove={removePlan}
              />
            )}
          </Modal>
        )}
    </main>
  );
}
