const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number, default: 0 },
    cards: [
        {
            type: Schema.Types.ObjectId,
            ref: "Cards",
        },
    ],
    history: { type: Array, default: [{}] },
    plannedTransfers: { type: Array, default: [{}] },
    blockedTransactions: { type: Array, default: [{}] },
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
