const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestsSchema = new Schema({
    title: String,
    content: String,
});

const Tests = mongoose.model("Tests", TestsSchema);
module.exports = Tests;
