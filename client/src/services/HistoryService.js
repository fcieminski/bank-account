import BaseService from "./BaseService";

class HistoryService extends BaseService {


    create(userId, params) {
        return this.axios.post(`/add-to-history/${userId}`, params).then(response => response.data);
    }

}

const historyService = new HistoryService();
export default historyService;