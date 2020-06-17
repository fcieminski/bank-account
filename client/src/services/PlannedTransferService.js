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
  updatePlannedTransfer(transferId, params) {
    return this.axios
      .put(`/update-planned/${transferId}`, params)
      .then(response => response.data);
  }
  deletePlannedTransfer(transferId) {
    return this.axios
      .delete(`/delete-planned/${transferId}`)
      .then(response => response.data);
  }
}

const plannedTransferService = new PlannedTransferService();
export default plannedTransferService;
