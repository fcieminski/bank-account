const Cards = require("../models/Cards");

class CardsController {
    create(req, res) {
        const { userId, accountId, cardCurrency, cardType } = req.body;
        const generatorElements = Array.from({ length: 16 }, (_, index) => index + 1).join("");
        let cardNumber = "";
        for (let i = 0; i < 16; i++) {
            cardNumber += generatorElements.charAt(Math.floor(Math.random() * 16));
        }
        const Card = new Cards({
            cardType,
            cardNumber,
            cardValid: true,
            cardCurrency,
            expirationDate: new Date(),
            holder: userId,
            account: accountId,
            limits: {
                web: {
                    daily: 1000,
                    monthly: 1000,
                },
            },
        });

        Card.save((error) => {
            if (error) res.send(error);
        });

        Cards.findOne({ holder: userId }).exec((error, card) => {
            if (error) res.send(error);
            else res.send({ card });
        });
    }

    findUserCards(req, res) {
        const { userId } = req.params;
        Cards.find({ holder: userId }).exec((error, cards) => {
            if (error) res.send(error);
            else res.send({ cards });
        });
    }
}

module.exports = new CardsController();
