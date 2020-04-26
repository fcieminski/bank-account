const Account = require("../models/Account");

class AccountController {
    find(req, res) {
        Account.findOwner(req.body.owner, (error, account) => {
            if (error) {
                res.send({ error });
            }
            res.send({
                account,
            });
        });
    }
}

module.exports = new AccountController();
