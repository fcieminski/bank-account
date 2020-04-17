import BaseService from "./BaseService";

class AuthService extends BaseService {
  create(params) {
    return this.axios.post("/register", params).then(response => response.data);
  }

  isAuth() {
    return this.axios.post("/user").then(response => response.data);
  }

  doLogin(params) {
    return this.axios.post("/login", params).then(response => response.data);
  }
}

const authService = new AuthService();
export default authService;
