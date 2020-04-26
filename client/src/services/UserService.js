import BaseService from "./BaseService";

class UserService extends BaseService {
  create(params) {
    return this.axios.post("/register", params).then(response => response.data);
  }
}

const userService = new UserService();
export default userService;