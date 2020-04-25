const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    owner: { type: Object, required: true },
    balance: Number,
    cards: Array,
    history: Array,
    plannedTransfers: Array,
    blockedTransactions: Array,
});

const Account = mongoose.model("Account", AccountSchema);

AccountSchema.methods.findOwner = function (callback) {
    return this.model("Account").find({ owner: this.owner }, callback);
};

module.exports = Account;
