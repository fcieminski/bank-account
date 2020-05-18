const History = require("../models/History");
const User = require("../models/User");
const Account = require("../models/Account");
const PDFDocument = require("pdfkit");

class HistoryController {
    constructor() {
        this.transferCode = [];
    }

    index(req, res) {
        const { userId } = req.params;
        let limit = +req.query.limit;
        let offset = +req.query.offset;
        console.log(req.query);
        Account.findOne({
            owner: userId,
        })
            .populate("history")
            .exec((error, account) => {
                if (error) {
                    res.send({ error: "no record" });
                } else {
                    if (offset > 0) {
                        account.history = account.history.slice(offset);
                    }

                    if (limit > 0) {
                        account.history = account.history.slice(0, limit);
                    }

                    res.send(account.history);
                }
            });
    }

    async makeTransfer(req, res) {
        const { date, name, amount, currency, title, from, to } = req.body;
        const { userId } = req.params;
        const Histories = new History({
            date,
            name,
            amount,
            currency,
            title,
            from,
            to,
        });
        try {
            const historySaved = await Histories.save();
            Account.findOne({ owner: userId })
                .populate("history")
                .exec((error, account) => {
                    if (error) {
                        res.status(404).send();
                    } else {
                        account.history.push(historySaved._id);
                        account.save();
                        res.send({ history: account.history });
                    }
                });
        } catch (error) {
            console.log(error);
            res.status(404).send();
        }
    }

    sendTransferCode = (req, res) => {
        const { userId } = req.params;
        this.transferCode.push(this.makeTransferCode(4, userId));
        const userCode = this.getUserCode(userId);
        res.send(userCode);
    };

    getUserCode = (userId) => {
        return this.transferCode.find((ele) => ele.id === userId);
    };

    compareUserCode = (req, res) => {
        const { code } = req.body;
        const { userId } = req.params;
        const userCode = this.getUserCode(userId);
        if (userCode.code === code) {
            res.send({ status: "success" });
        } else {
            res.send({ status: "failure" });
        }
    };

    makeTransferCode(length, id) {
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return {
            id,
            code: result,
        };
    }

    getTransferPDF(req, res) {
        const doc = new PDFDocument();
        res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=sample.pdf",
        });
        doc.text("blablablas").fontSize(50);

        doc.end();
        doc.pipe(res);
    }
}

module.exports = new HistoryController();
