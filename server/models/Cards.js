const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardsSchema = new Schema(
    {
        cardType: { type: String, required: true },
        cardValid: { type: Boolean, required: true },
        expirationDate: { type: Date, required: true },
        holder: { type: Schema.Types.ObjectId, ref: "User" },
        account: { type: Schema.Types.ObjectId, ref: "Account" },
        limits: { type: Map, required: true },
        cardNumber: { type: String, required: true },
        cardCurrency: { type: String, default: "PLN" },
    },
    {
        timestamps: true,
    }
);

const Cards = mongoose.model("Cards", CardsSchema);
module.exports = Cards;
