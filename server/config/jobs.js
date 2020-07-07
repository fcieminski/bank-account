const PlannedTransfers = require("../models/PlannedTransfers");

module.exports = (agenda) => {
    agenda.define("planned transfer", async (job) => {
        const plannedTransfer = await PlannedTransfers.findOne({ _id: job.attrs.data.transfer });
        console.log(plannedTransfer._id);
    });
};
