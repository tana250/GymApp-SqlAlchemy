import request from "./api";


const planesApi = {

  getAll() {
    return request("/planes/");
  },


  getById(id) {
    return request(`/planes/${id}`);
  },


  insert(plan) {

    return request("/planes/", {
      method: "POST",

      body: JSON.stringify({
        nombre: plan.nombre,
        valor: plan.valor,
        descripcion: plan.descripcion,
      }),
    });

  },


  update(id, plan) {

    return request(`/planes/${id}`, {
      method: "PATCH",

      body: JSON.stringify({
        nombre: plan.nombre,
        valor: plan.valor,
        descripcion: plan.descripcion,
      }),
    });

  },


  deactivate(id) {

    return request(`/planes/${id}`, {
      method: "PATCH",

      body: JSON.stringify({
        activo: false,
      }),
    });

  },

};


export default planesApi;