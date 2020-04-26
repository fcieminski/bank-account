const Account = require("../models/Account");

class AccountController {
    async create(req) {
        const user = req.user;

        if (user) {
            const Accounts = new Account({
                owner: user.id,
            });

            const newAccount = await Accounts.save();

            return newAccount;
        }
    }
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
