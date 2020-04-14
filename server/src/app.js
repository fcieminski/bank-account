const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Test = require("../models/test");

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/bank-account", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("DB Connected!"))
    .catch((err) => {
        console.log(`DB Connection Error: ${err.message}`);
    });

app.post("/test", (req, res) => {
    const db = req.db;
    const title = req.body.title;
    const description = req.body.description;
    const testData = new Test({
        title,
        description,
    });

    testData.save((error) => {
        if (error) {
            console.log(error);
        }
        res.send({
            success: true,
            message: "Post saved successfully!",
        });
    });
});

app.get("/test", (req, res) => {
    Test.find({}, "title description", (error, posts) => {
        if (error) {
            console.error(error);
        }
        res.send({
            posts: posts,
        });
    }).sort({ _id: -1 });
});

app.listen(process.env.PORT || 8081);
