const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlannedTransfersSchema = new Schema(
    {
        name: { type: String, required: true },
        title: { type: String, required: true },
        to: {
            name: { type: String, required: true },
            accountNumber: { type: String, required: true },
            city: String,
            street: String,
            home: String,
            postalCode: String,
        },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        period: { type: String, default: "1m" },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        accountId: { type: Schema.Types.ObjectId, ref: "Account" },
        from: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

const PlannedTransfers = mongoose.model("PlannedTransfers", PlannedTransfersSchema);
module.exports = PlannedTransfers;
