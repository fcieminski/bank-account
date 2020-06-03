const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardsSchema = new Schema({
    cardType: String,
    cardValid: Boolean,
    expirationDate: Date,
    holder: { type: Schema.Types.ObjectId, ref: "User" },
    account: { type: Schema.Types.ObjectId, ref: "Account" },
    limits: Map,
    cardNumber: String,
    cardCurrency: { type: String, default: "PLN" }
});

const Cards = mongoose.model("Cards", CardsSchema);
module.exports = Cards;
