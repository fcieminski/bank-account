const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema(
    {
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        title: { type: String, required: true },
        accountId: { type: Schema.Types.ObjectId, ref: "Account" },
        from: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        to: {
            name: { type: String, required: true },
            accountNumber: { type: String, required: true },
            city: String,
            street: String,
            home: String,
            postalCode: String,
        },
        bicCode: { type: String, default: "PRPLPW" },
    },
    {
        timestamps: true,
    }
);

const History = mongoose.model("History", HistorySchema);
module.exports = History;
