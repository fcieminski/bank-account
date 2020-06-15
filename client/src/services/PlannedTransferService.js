import BaseService from "./BaseService";

class PlannedTransferService extends BaseService {
  getUserPlannedTransfers(userId) {
    return this.axios
      .post(`/get-planned/${userId}`)
      .then(response => response.data);
  }
  create(userId, params) {
    return this.axios
      .post(`/make-planned/${userId}`, params)
      .then(response => response.data);
  }
}

const plannedTransferService = new PlannedTransferService();
export default plannedTransferService;
