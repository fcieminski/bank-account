import BaseService from "./BaseService";

export default class PostService extends BaseService {
  getPosts() {
    return this.axios.get("/posts").then(response => response.data);
  }
}
