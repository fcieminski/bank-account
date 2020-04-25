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

    create(req, res) {
        const Accounts = new Account({
            owner: req.body.owner,
            balance: 0,
            cards: [],
            history: [],
            plannedTransfers: [],
            blockedTransactions: [],
        });

        Accounts.save((error) => {
            if (error) {
                res.send({ error });
            } else {
                res.send("created");
            }
        });
    }
}

module.exports = new AccountController();
