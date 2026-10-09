import request from "./api";

const authApi = {
  me() {
    return request("/auth/me");
  },

  login(username, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
  },

  logout() {
    return request("/auth/logout", {
      method: "POST",
    });
  },
};

export default authApi;