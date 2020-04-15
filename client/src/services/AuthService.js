import BaseService from "./BaseService";

class AuthService extends BaseService {
  create(params) {
    return this.axios.post("/login", params).then(response => response.data);
  }
}

const authService = new AuthService();
export default authService;
