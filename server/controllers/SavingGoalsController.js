const SavingGoals = require("../models/SavingGoals");

class SavingGoalsController {
    create(req, res) {
        const { id } = req.user;
        const { name, description, image, category, amount } = req.body;

        const goal = {
            name,
            description,
            image,
            category,
            amount,
        };

        new SavingGoals(goal).save();

        res.status(201).send();
    }
}


module.exports = new SavingGoalsController();