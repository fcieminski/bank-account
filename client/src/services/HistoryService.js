import BaseService from "./BaseService";

class HistoryService extends BaseService {

    getHistory(userId, query) {
        return this.axios.post(`/history/${userId}${query ? query : ''}`).then(response => response.data)
    }

    create(userId, params) {
        return this.axios.post(`/add-to-history/${userId}`, params).then(response => response.data);
    }

    getCode(userId) {
        return this.axios.get(`/add-to-history/${userId}/get-code`).then(response => response.data);
    }

    sendCode(userId, params) {
        return this.axios.post(`/add-to-history/${userId}/send-code`, params).then(response => response.data);
    }

    getPDF(params) {
        return this.axios.post('/pdf', params).then(response => response.data)
    }

}

const historyService = new HistoryService();
export default historyService;