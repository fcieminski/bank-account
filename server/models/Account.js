const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountNumber = () => {
    const numberArr = Array.from({ length: 26 });
    return numberArr.map((ele) => (ele = Math.floor(Math.random() * 10))).join("");
};

const AccountSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        description: { type: String, default: "Konto Przyjazne" },
        balance: { type: Number, default: 0 },
        cards: [
            {
                type: Schema.Types.ObjectId,
                ref: "Cards",
            },
        ],
        history: [
            {
                type: Schema.Types.ObjectId,
                ref: "History",
            },
        ],
        plannedTransfers: [
            {
                type: Schema.Types.ObjectId,
                ref: "PlannedTransfers",
            },
        ],
        accountNumber: { type: String, default: accountNumber },
        type: { type: String, default: "current" },
        currencyName: { type: String, default: "PLN" },
    },
    {
        timestamps: true,
    }
);

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
