import BaseService from "./BaseService";

class AccountService extends BaseService {
    create(params) {
        return this.axios.post("/account-create", params).then(response => response.data);
    }

    getUserAccount(params) {
        return this.axios.post("/account-owner", params).then(response => response.data);
    }
}

const accountService = new AccountService();
export default accountService;
