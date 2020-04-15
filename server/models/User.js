const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);
module.exports = User;