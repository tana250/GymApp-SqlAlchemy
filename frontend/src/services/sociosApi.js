import request from "./api";

const sociosApi = {
  getAll() {
    return request("/socios/");
  },

  getById(id) {
    return request(`/socios/${id}`);
  },

  insert(socio) {
    return request("/socios/", {
      method: "POST",
      body: JSON.stringify(socio),
    });
  },

  update(id, socio) {
    return request(`/socios/${id}`, {
      method: "PATCH",
      body: JSON.stringify(socio),
    });
  },

  deactivate(id) {
    return request(`/socios/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        activo: false,
      }),
    });
  },
};

export default sociosApi;