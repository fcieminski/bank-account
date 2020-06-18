const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    date: Date,
    name: String,
    amount: Number,
    currency: String,
    title: String,
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    to: {
        name: String,
        accountNumber: String,
    },
});

const History = mongoose.model("History", HistorySchema);
module.exports = History;
