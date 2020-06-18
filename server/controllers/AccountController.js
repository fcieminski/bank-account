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

        Account.findOne({ owner: userId })
            .populate("cards")
            .exec((error, account) => {
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
                console.log(user);
                if (error) {
                    res.send({ error: "no record" });
                } else {
                    res.send(user.accounts);
                }
            });
    }
    
    async getAccountStats(req, res) {
        const { accountId } = req.params;
        const today = new Date();

        try {
            const accountHistoryStats = await Account.findOne({ _id: accountId })
                .select("history")
                .populate("history", "name amount date");

            const sumUp = accountHistoryStats.history
                .filter((history) => {
                    console.log(history);
                    return new Date(history.date).getMonth() === today.getMonth() && new Date(history.date).getFullYear() === today.getFullYear();
                })
                .reduce(
                    (prev, curr) => {
                        if (curr.name === "income") {
                            prev.income += curr.amount;
                        } else {
                            prev.transfer += curr.amount;
                        }
                        return prev;
                    },
                    { income: 0, transfer: 0 }
                );

            res.send(sumUp);
        } catch {
            res.status(500).send("error");
        }
    }
}

module.exports = new AccountController();
