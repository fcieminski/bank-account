const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true },
        surname: { type: String, required: true },
        city: String,
        street: String,
        home: String,
        postalCode: String,
        email: { type: String, required: true },
        phone: String,
        accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    },
    {
        timestamps: true,
    }
);

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);
module.exports = User;
