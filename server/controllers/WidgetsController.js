const Widgets = require("../models/Widgets");

class WidgetsController {
    create(req, res) {
        const { name, userId } = req.body;

        new Widgets({ name, owner: userId }).save();

        res.status(201).send();
    }

    index(req, res) {
        const { userId } = req.params;

        Widgets.find({ owner: userId }).exec((error, widgets) => {
            if (error) res.status(500).send(error);
            else res.status(200).send(widgets);
        });
    }
}

module.exports = new WidgetsController();
