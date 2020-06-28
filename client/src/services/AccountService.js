import BaseService from "./BaseService";

class AccountService extends BaseService {
  create(params) {
    return this.axios
      .post("/account/create", params)
      .then(response => response.data);
  }

  getUserAccounts(userId) {
    return this.axios
      .get(`/user-accounts/${userId}`)
      .then(response => response.data);
  }

  findUserAccount(userId) {
    return this.axios.get(`/account/${userId}`).then(response => response.data);
  }

  getAccountStats(accountId) {
    return this.axios
      .get(`/account/${accountId}/stats`)
      .then(response => response.data);
  }

  createSavingGoal(accountId, params) {
    return this.axios
      .post(`/account/${accountId}/make-goal`, params)
      .then(response => response.data);
  }

  getGoals(accountId) {
    return this.axios
      .get(`/account/${accountId}/get-goals`)
      .then(response => response.data);
  }

  deleteGoal(goalId, accountId) {
    return this.axios
      .delete(`/account/${accountId}/goal/${goalId}/delete`)
      .then(response => response.data);
  }

  transferToGoal(goalId, params) {
    return this.axios
      .post(`/account/${goalId}/transfer-to-goal`, params)
      .then(response => response.data);
  }
}

const accountService = new AccountService();
export default accountService;
