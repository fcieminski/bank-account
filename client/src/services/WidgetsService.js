import BaseService from "./BaseService";

class WidgetsService extends BaseService {
  list(userId) {
    return this.axios
      .get(`/get-widgets/${userId}`)
      .then(response => response.data);
  }

  create(params) {
    return this.axios
      .post("/make-widget", params)
      .then(response => response.data);
  }

  delete(widgetId) {
    return this.axios
      .delete(`/delete-widget/${widgetId}`)
      .then(response => response.data);
  }
}

const widgetsService = new WidgetsService();
export default widgetsService;
