import BaseService from "./BaseService";

class CardsService extends BaseService {
    create(params) {
        return this.axios.post("/create-new-card", params).then(response => response.data);
    }
}

const cardsService = new CardsService();
export default cardsService;
