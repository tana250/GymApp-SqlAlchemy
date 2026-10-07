import request from "./api";

const cuotasPlanesApi = {
  getAll() {
    return request("/cuotasPlanes/");
  },

  getById(id) {
    return request(`/cuotasPlanes/${id}`);
  },
};

export default cuotasPlanesApi;