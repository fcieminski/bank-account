const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlannedTransfersSchema = new Schema({
    name: String,
    title: String,
    to: {
        name: String,
        accountNumber: String,
    },
    amount: Number,
    currency: String,
    period: { type: String, default: "1m" },
    date: Date,
})

const PlannedTransfers = mongoose.model('PlannedTransfers', PlannedTransfersSchema);
module.exports = PlannedTransfers;