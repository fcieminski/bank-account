const History = require("../models/History");
const User = require("../models/User");
const Account = require("../models/Account");

class HistoryController {
    index(req, res) {
        const { userId } = req.params;
        Account.findOne({
            owner: userId,
        })
            .populate("history")
            .exec((error, account) => {
                if (error) {
                    res.send({ error: "no record" });
                } else {
                    res.send({ history: account.history });
                }
            });
    }

    async makeTransfer(req, res) {
        const { date, name, amount, currency, title, from, to } = req.body;
        const { userId } = req.params;
        const Histories = new History({
            date,
            name,
            amount,
            currency,
            title,
            from,
            to,
        });
        try {
            const historySaved = await Histories.save();
            Account.findOne({ owner: userId }).populate("history").exec((error, account) => {
                if (error) {
                    res.status(404).send();
                } else {
                    account.history.push(historySaved._id);
                    account.save();
                    res.send({ history: account.history });
                }
            });
        } catch (error) {
            console.log(error)
            res.status(404).send();
        }
    }
}

module.exports = new HistoryController();
