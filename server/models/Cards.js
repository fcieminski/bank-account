const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardsSchema = new Schema({
    cardName: String,
    cardNumber: Number,
    cardValid: Boolean,
    expirationDate: Date,
    holder: { type: Schema.Types.ObjectId, ref: "User" },
    account: { type: Schema.Types.ObjectId, ref: "Account" },
    limits: Map,
});

const Cards = mongoose.model("Cards", CardsSchema);
module.exports = Cards;
