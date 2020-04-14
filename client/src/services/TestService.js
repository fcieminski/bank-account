import BaseService from "./BaseService";

class TestService extends BaseService {
  get() {
    return this.axios.get("/tests").then(response => response.data);
  }
  post(params) {
    return this.axios.post("/tests", params).then(response => response.data);
  }
  update(id, params) {
    return this.axios
      .put(`/tests/${id}`, params)
      .then(response => response.data);
  }
  find(id) {
    return this.axios.get(`/tests/${id}`).then(response => response.data);
  }
}

const testService = new TestService();
export default testService;
