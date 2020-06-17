const PlannedTransfers = require("../models/PlannedTransfers");
const Account = require("../models/Account");

class PlannedTransferController {
    index(req, res) {
        const { userId } = req.params;

        PlannedTransfers.find({ from: userId }).exec((error, transfers) => {
            if (error) res.send(error);
            else res.send(transfers);
        });
    }

    async create(req, res) {
        const { userId } = req.params;
        const { transfer } = req.body;
        const { name, title, to, amount, currency, period, date } = transfer;

        try {
            const newTransfer = await new PlannedTransfers({
                ...transfer,
                from: userId,
            }).save();

            Account.findOne({ owner: userId }).exec((error, account) => {
                if (error) res.send(error);
                else {
                    account.plannedTransfers.push(newTransfer._id);
                    account.save();
                    res.status(201).send({ newTransfer });
                }
            });
        } catch {
            res.send("error!");
        }
    }

    updateTransfer(req, res) {
        const { transferId } = req.params;
        const { update } = req.body;

        PlannedTransfers.findOne({ _id: transferId }).exec((error, transfer) => {
            if (error) res.send(error);
            else {
                transfer.name = update.name;
                transfer.currency = "PLN";
                transfer.title = update.title;
                transfer.to = update.to;
                transfer.amount = update.amount;
                transfer.period = update.period;
                transfer.save();
                res.send("saved");
            }
        });
    }
}

module.exports = new PlannedTransferController();
