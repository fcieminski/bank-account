const Account = require("../models/Account");
const User = require("../models/User");

class AccountController {
    async create(req) {
        const user = req.user;

        if (user) {
            const Accounts = new Account({
                owner: user.id,
            });
            const newAccount = await Accounts.save();
            return newAccount;
        }
    }
    find(req, res) {
        const owner = req.body.owner;
        
        User.findOne({ _id: owner._id })
            .populate("account")
            .exec((error, user) => {
                if (error) {
                    res.send({ error: "no record" });
                } else {
                    res.send({ user });
                }
            });
    }
}

module.exports = new AccountController();
