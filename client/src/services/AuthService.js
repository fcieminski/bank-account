import BaseService from "./BaseService";

class AuthService extends BaseService {
  signIn(params) {
    return this.axios.post("/login", params).then(response => response.data);
  }

  logout() {
    return this.axios.post("/logout").then(response => response.data);
  }

  isAuth() {
    return this.axios.post("/user").then(response => response.data);
  }
}

const authService = new AuthService();
export default authService;
