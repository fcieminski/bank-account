const PlannedTransfers = require("../models/PlannedTransfers");
const HistoryController = require("../controllers/HistoryController");
const History = require("../models/History");
const Account = require("../models/Account");

module.exports = (agenda) => {
    agenda.define("plannedTransfer", async (job) => {
        const plannedTransfer = await PlannedTransfers.findOne({ _id: job.attrs.data.transfer });
        const transfer = plannedTransfer.toObject();
        const { amount, currency, title, to, accountId, from } = transfer;

        const history = {
            type: "transfer",
            amount,
            currency,
            title,
            accountId,
            from,
            to: {
                ...to,
                accountNumber: to.accountNumber.toString(),
            },
        };

        try {
            if (typeof history.amount === "number") {
                const historySaved = await new History(history).save();

                Account.findOne({ _id: accountId })
                    .populate("history")
                    .exec((error, account) => {
                        if (error) {
                            job.fail(error);
                        } else {
                            if (account.balance >= history.amount) {
                                account.history.push(historySaved._id);
                                account.balance -= history.amount;
                                account.save();
                            } else {
                                job.fail("low on budget");
                            }
                        }
                    });

                Account.findOne({ accountNumber: to.accountNumber.toString() })
                    .populate("history")
                    .exec((error, account) => {
                        if (error) {
                            return;
                        } else {
                            HistoryController.receiveTransfer(history, account);
                        }
                    });
            }
        } catch (error) {
            job.fail(error);
        }
    });
};
