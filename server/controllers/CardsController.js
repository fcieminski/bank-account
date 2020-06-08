const Cards = require("../models/Cards");
const Account = require("../models/Account");

class CardsController {
    async create(req, res) {
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
        try {
            const savedCard = await Card.save();

            Account.findOne({ _id: accountId }).exec((error, account) => {
                if (error) res.send(error);
                else {
                    account.cards.push(savedCard._id);
                    account.save();
                }
            });

            Cards.findOne({ _id: savedCard._id }).exec((error, card) => {
                if (error) res.send(error);
                else res.send({ card });
            });
        } catch {
            res.send("error!");
        }
    }

    findUserCards(req, res) {
        const { userId } = req.params;
        Cards.find({ holder: userId }).exec((error, cards) => {
            if (error) res.send(error);
            else res.send({ cards });
        });
    }

    updateCard(req, res){
        const { cardId } = req.params;
        const { cardToUpdate } = req.body;

        Cards.findOne({_id: cardId}).exec((error, card) => {
            if(error) res.send({error});
            else {
                card.limits = cardToUpdate.limits;
                card.save();
            }
        })
    }
}

module.exports = new CardsController();
