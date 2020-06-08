import BaseService from "./BaseService";

class CardsService extends BaseService {
  create(params) {
    return this.axios
      .post("/create-new-card", params)
      .then(response => response.data);
  }

  find(userId) {
    return this.axios
      .post(`/find-card/${userId}`)
      .then(response => response.data);
  }

  update(cardId, params) {
    return this.axios
      .patch(`/update/${cardId}`, params)
      .then(response => response.data);
  }
}

const cardsService = new CardsService();
export default cardsService;
