import BaseService from "./BaseService";

class PostService extends BaseService {
  getPosts() {
    return this.axios.get("/posts").then(response => response.data);
  }
}

const postService = new PostService();
export default postService;
