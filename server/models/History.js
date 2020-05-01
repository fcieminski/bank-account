const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    date: Date,
    name: String,
    amount: Number,
    currency: String,
    title: String,
    from: String,
    to: String,
})

const History = mongoose.model('History', HistorySchema);
module.exports = History;