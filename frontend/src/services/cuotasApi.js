import request from "./api";

const cuotasApi = {
  getAll() {
    return request("/cuotas/");
  },

  getById(id) {
    return request(`/cuotas/${id}`);
  },

  update(id, cuota) {
    return request(`/cuotas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(cuota),
    });
  },

  generar(año, mes) {
    return request("/cuotas/generar", {
      method: "POST",
      body: JSON.stringify({
        año,
        mes,
      }),
    });
  },
};

export default cuotasApi;