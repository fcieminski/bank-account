const PlannedTransfers = require("../models/PlannedTransfers");
const Account = require("../models/Account");

class PlannedTransferController {
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
}

module.exports = new PlannedTransferController();
