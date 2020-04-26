const Cards = require("../models/Cards");

class CardsController {
    create(req, res) {
        const Card = new Cards({
            cardName: "Visa",
            cardNumber: 123456789,
            cardValid: true,
            expirationDate: new Date(),
            holder: req.body.user,
            account: req.body.account,
            limits: {
                web: {
                    daily: 1000,
                    monthly: 1000,
                },
            },
        });

        Card.save((error) => {
            if (error) res.send(error);
            res.send("ok");
        });
    }
}

module.exports = new CardsController();
