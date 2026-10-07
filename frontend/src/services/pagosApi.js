import request from "./api";

const pagosApi = {
  getAll() {
    return request("/pagos/");
  },

  getById(id) {
    return request(`/pagos/${id}`);
  },

  insert(pago) {
    return request("/pagos/", {
      method: "POST",
      body: JSON.stringify(pago),
    });
  },

  update(id, pago) {
    return request(`/pagos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(pago),
    });
  },

  remove(id) {
    return request(`/pagos/${id}`, {
      method: "DELETE",
    });
  },
};

export default pagosApi;