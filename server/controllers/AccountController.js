const Account = require("../models/Account");
const User = require("../models/User");
const SavingGoals = require("../models/SavingGoals");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

class AccountController {
    async create(req, type, description) {
        const user = req.user;

        if (user) {
            const Accounts = new Account({
                owner: user.id,
                ...(type && { type }),
                ...(description && { description }),
            });
            const newAccount = await Accounts.save();
            return newAccount;
        }
    }

    createNewAccount = async (req, res) => {
        const { description, type } = req.body;
        const { id } = req.user;

        const newAccount = await this.create(req, type, description);
        if (newAccount) {
            User.findOne({ _id: id }).exec((error, user) => {
                if (error) res.status(500).send("erorr");
                else {
                    user.accounts.push(newAccount._id);
                    user.save();
                    res.status(201).send(newAccount);
                }
            });
        }
    };

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

    async createSavingGoal(req, res) {
        try {
            const { id } = req.user;
            const { accountId } = req.params;
            const { name, description, category, amount, fileName } = req.body;
            const image = req.file ? `${process.env.API_URL}/uploads/${req.file.filename}` : "https://picsum.photos/200/200";
            const imageName = fileName || "randomPhoto";

            const goal = {
                owner: id,
                name,
                description,
                category,
                amount,
                fileName: imageName,
                accountId,
                image,
            };

            const createdGoal = await new SavingGoals(goal).save();
            res.status(201).send(createdGoal);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    getCurrentGoals(req, res) {
        const { accountId } = req.params;

        SavingGoals.find({ accountId }).exec((error, goals) => {
            if (error) res.status(500).send(error);
            else res.send(goals);
        });
    }

    deleteGoal(req, res) {
        const { goalId, accountId } = req.params;

        SavingGoals.findOneAndDelete({ _id: goalId }).exec((error, goal) => {
            if (error) res.status(500).send(error);
            else {
                let currentAccount;
                if (goal.currentAmount > 0) {
                    Account.findOne({ _id: accountId }).exec((error, account) => {
                        if (error) res.status(500).send(error);
                        else {
                            account.balance += goal.currentAmount;
                            account.save();
                            currentAccount = account;
                            res.status(202).send({ balance: currentAccount.balance });
                        }
                    });
                } else {
                    res.status(202).send();
                }

                const link = new URL(goal.image);
                const filePath = path.join(__dirname, "..", link.pathname);
                fs.readFile(filePath, (error, file) => {
                    if (file) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
        });
    }

    transferMoneyToGoal(req, res) {
        const { goalId } = req.params;
        const { accountId, amount } = req.body;

        Account.findOne({ _id: accountId }).exec((error, account) => {
            if (error) res.status(500).send(error);
            else {
                SavingGoals.findOne({ _id: goalId }).exec((error, goal) => {
                    if (error) res.status(500).send(error);
                    else {
                        if (typeof amount === "number" && account.balance >= amount) {
                            goal.currentAmount += amount;
                            account.balance -= amount;
                            goal.isDone = goal.currentAmount >= goal.amount && true;
                            goal.save();
                            account.save();
                            res.status(202).send({ goal, accountBalance: account.balance });
                        } else {
                            res.status(406).send({ error: "Za mało środków!" });
                        }
                    }
                });
            }
        });
    }
}

module.exports = new AccountController();
