const TestController = require("../controllers/TestController");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());
const User = require("../models/User");


app.post("/login", (req, res) => {
    const Users = new User({
        email: req.body.email,
        username: req.body.username,
        surname: req.body.surname,
        name: req.body.name,
        phone: req.body.phone,
    });

    User.register(Users, req.body.password, (err, user) => {
        if (err) {
            res.json({ success: false, message: err, });
        } else {
            res.json({ success: true });
        }
    });
});
app.get("/tests", TestController.index);
app.put("/tests/:id", TestController.update);
app.get("/tests/:id", TestController.find);
app.post("/tests", TestController.createTest);

module.exports = app;
