require("dotenv").config();
const Agenda = require("agenda");

const agenda = new Agenda({ db: { address: process.env.MONGO_URI, options: { useUnifiedTopology: true } } });

require("./jobs")(agenda);

agenda.start();

module.exports = agenda;
