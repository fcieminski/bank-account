import BaseService from "./BaseService";

class HistoryService extends BaseService {

    getHistory(userId) {
        return this.axios.post(`/history/${userId}`).then(response => response.data)
    }

    create(userId, params) {
        return this.axios.post(`/add-to-history/${userId}`, params).then(response => response.data);
    }

}

const historyService = new HistoryService();
export default historyService;