const PlannedTransfers = require("../models/PlannedTransfers");
const Account = require("../models/Account");
const agenda = require("../config/agenda");
const Mongoose = require("mongoose");

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
                    const job = agenda.create("plannedTransfer", { transfer: newTransfer._id });
                    job.repeatEvery(newTransfer.period === "d" ? "every day" : "every month", {
                        timezone: "Europe/Warsaw",
                        skipImmediate: true,
                    });
                    job.save();
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
                transfer.startDate = update.startDate;
                transfer.endDate = update.endDate;
                transfer.save();
                res.send("saved");
            }
        });
    }

    deleteTransfer(req, res) {
        const { transferId } = req.params;

        PlannedTransfers.deleteOne({ _id: transferId }).exec((err) => {
            if (err) res.send("error");
            else {
                agenda.cancel({ data: { transfer: Mongoose.Types.ObjectId(transferId) } });
                res.status(200).send("deleted");
            }
        });
    }
}

module.exports = new PlannedTransferController();
