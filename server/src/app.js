const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Tests = require("../models/test");

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

app.post("/tests", (req, res) => {
    const { body } = req;
    const testsData = new Tests({
        ...body,
    });

    testsData.save((error) => {
        if (error) {
            console.log(error);
        }
        res.send({
            success: true,
            message: "Post saved successfully!",
        });
    });
});

app.get("/tests", (req, res) => {
    Tests.find((error, tests) => {
        if (error) {
            console.error(error);
        }
        res.send({
            tests,
        });
    }).sort({ _id: -1 });
});

app.put("/tests/:id", (req, res) => {
    const { body } = req;
    Tests.findById(req.params.id, (error, test) => {
        if (error) {
            res.status(500).send({
                error,
            });
        }
        test.title = body.title;
        test.content = body.content;
        test.save((error) => {
            if (error) {
                res.status(500).send({
                    error,
                });
            } else {
                res.send({
                    test,
                });
            }
        });
    });
});

app.get("/tests/:id", (req, res) => {
    console.log(req.params.id);
    Tests.findById(req.params.id, (error, test) => {
        if (error) {
            console.error(error);
        }
        res.send({
            test,
        });
    });
});

app.listen(process.env.PORT || 8081);
