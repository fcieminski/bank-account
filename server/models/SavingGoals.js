const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SavingGoalsSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        accountId: { type: Schema.Types.ObjectId, ref: "Account" },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        currentAmount: { type: Number, default: 0 },
        description: String,
        isDone: { type: Boolean, default: false },
        category: { type: String, required: true },
        image: { type: String, default: "https://picsum.photos/200/200" },
    },
    {
        timestamps: true,
    }
);

const SavingGoals = mongoose.model("SavingGoals", SavingGoalsSchema);

module.exports = SavingGoals;
