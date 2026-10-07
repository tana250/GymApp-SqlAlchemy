import request from "./api";

const telefonosApi = {
  getAll() {
    return request("/telefonos/");
  },

  insert(telefono) {
    return request("/telefonos/", {
      method: "POST",
      body: JSON.stringify({
        socioId: telefono.socioId,
        numero: telefono.numero,
      }),
    });
  },

  remove(socioId, numero) {
    return request(
      `/telefonos/${socioId}/${encodeURIComponent(numero)}`,
      {
        method: "DELETE",
      }
    );
  },
};

export default telefonosApi;