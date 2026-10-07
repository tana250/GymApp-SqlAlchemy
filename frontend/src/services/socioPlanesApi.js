import request from "./api";

const socioPlanesApi = {
  getAll() {
    return request("/socioPlanes/");
  },

  insert(socioPlan) {
    return request("/socioPlanes/", {
      method: "POST",
      body: JSON.stringify({
        socioId: socioPlan.socioId,
        planId: socioPlan.planId,
      }),
    });
  },

  remove(socioId, planId) {
    return request(
      `/socioPlanes/${socioId}/${planId}`,
      {
        method: "DELETE",
      }
    );
  },
};

export default socioPlanesApi;