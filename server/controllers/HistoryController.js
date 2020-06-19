const History = require("../models/History");
const User = require("../models/User");
const Account = require("../models/Account");
const PDFDocument = require("pdfkit");
const path = require("path");

class HistoryController {
    constructor() {
        this.transferCode = [];
    }

    index(req, res) {
        const { userId } = req.params;
        let limit = +req.query.limit;
        let offset = +req.query.offset;
        const options = {
            sort: {
                _id: "desc",
            },
            skip: offset,
            limit,
        };
        const currentAccount = Account.findOne({
            owner: userId,
        });
        currentAccount.exec((err, acc) => {
            currentAccount
                .populate([
                    {
                        path: "history",
                        options,
                    },
                ])
                .exec((error, account) => {
                    if (error || err) {
                        res.send({ error: "no record" });
                    } else {
                        res.send({ history: account.history, pagination: acc.history.length });
                    }
                });
        });
    }

    searchInHistory(req, res) {
        const { userId } = req.params;
        const { searchQuery } = req.body;
        History.find({
            from: userId,
            ...(searchQuery.title && { title: { $regex: searchQuery.title, $options: "i" } }),
            ...(searchQuery.date && { date: { $gte: searchQuery.date[0], $lt: searchQuery.date[1] } }),
            ...(searchQuery.amountFrom && { amount: { $gte: searchQuery.amountFrom, $lt: searchQuery.amountTo } }),
            ...(searchQuery.type !== 0 && { name: searchQuery.type === 1 ? "income" : "transfer" }),
        }).exec((error, history) => {
            res.send({ history });
        });
    }

    makeTransfer = async (req, res) => {
        const { date, name, amount, currency, title, to, accountId, from } = req.body;
        const { userId } = req.params;
        const history = {
            date,
            name,
            amount,
            currency,
            title,
            accountId,
            from,
            to: {
                name: to.name,
                accountNumber: to.accountNumber.toString(),
            },
        };
        try {
            const historySaved = await new History(history).save();
            Account.findOne({ _id: accountId })
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
            Account.findOne({ accountNumber: to.accountNumber.toString() })
                .populate("history")
                .exec((error, account) => {
                    if (error) {
                        return;
                    } else {
                        this.receiveTransfer(history, account);
                    }
                });
        } catch (error) {
            res.status(404).send();
        }
    };

    async receiveTransfer(history, acc) {
        try {
            const newHistory = await new History({ ...history, name: "income" }).save();
            acc.history.push(newHistory._id);
            acc.balance += newHistory.amount;
            acc.save();
        } catch (err) {
            return;
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

    getTransferPDF = async (req, res) => {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        const elements = Object.values(req.query);
        const transactionsPromises = elements.map((ele) => {
            return new Promise((resolve, reject) =>
                History.findById(ele).exec((err, transaction) => {
                    if (err) {
                        reject;
                    }
                    resolve(transaction);
                })
            );
        });
        Promise.all(transactionsPromises)
            .then((transactions) => {
                const logo = path.resolve(__dirname, "../src/img/logo.png");
                const font = path.resolve(__dirname, "../src/fonts/Basic.ttf");
                this.getHeader(doc, logo, font);
                this.getPDFContent(doc, font, transactions);
                doc.pipe(res);
                doc.end();
            })
            .catch((error) => {
                res.send("Błąd!");
            });
    };

    getHeader = (doc, logo, font) => {
        doc.image(logo, 50, 45, { width: 50 })
            .fillColor("#444444")
            .moveDown()
            .fontSize(20)
            .font(font)
            .text("Purple Bank", 110, 57)
            .fontSize(10)
            .font(font)
            .text("ul. Piękna 32", 200, 65, { align: "right" })
            .text("50-506, Wrocław", 200, 80, { align: "right" })
            .moveDown();
    };

    getPDFContent = (doc, font, content) => {
        doc.font(font)
            .text(`Data zestawienia: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 50, 200)
            .text(
                `Kwota zestawienia: ${content
                    .map((ele) => ele.amount)
                    .reduce((prev, curr) => {
                        return prev + curr;
                    })} PLN`,
                50,
                215
            );
        let position = 315;
        content.forEach((ele, index) => {
            doc.fontSize(10)
                .font(font)
                .text(ele.to.name, 50, position + (index + 1) * 30)
                .text(ele.to.accountNumber, 150, position + (index + 1) * 30)
                .text(`${ele.amount} ${ele.currency}`, 0, position + (index + 1) * 30, { align: "right" });
        });
    };
}

module.exports = new HistoryController();
