import request from "./api";

const metodosPagoApi = {
  getAll() {
    return request("/metodosPago/");
  },

  getById(id) {
    return request(`/metodosPago/${id}`);
  },

  insert(metodo) {
    return request("/metodosPago/", {
      method: "POST",
      body: JSON.stringify(metodo),
    });
  },

  update(id, metodo) {
    return request(`/metodosPago/${id}`, {
      method: "PATCH",
      body: JSON.stringify(metodo),
    });
  },

  remove(id) {
    return request(`/metodosPago/${id}`, {
      method: "DELETE",
    });
  },
};

export default metodosPagoApi;