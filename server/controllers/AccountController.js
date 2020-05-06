const Account = require("../models/Account");
const User = require("../models/User");

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

    findAccount(req, res) {
        const userId = req.params.userId;

        Account.findOne({ owner: userId }, (error, account) => {
            if (error) {
                res.send({ error: "no record" });
            } else {
                res.send(account);
            }
        });
    }

    findAllUserAccounts(req, res) {
        const userId = req.params.userId;

        User.findOne({ _id: userId })
            .populate("accounts")
            .exec((error, user) => {
                if (error) {
                    res.send({ error: "no record" });
                } else {
                    res.send(user.accounts);
                }
            });
    }
}

module.exports = new AccountController();
