const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WidgetsSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Widgets = mongoose.model("Widgets", WidgetsSchema);
module.exports = Widgets;
