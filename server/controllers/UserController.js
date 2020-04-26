const User = require("../models/User");
const Account = require("../models/Account");
const passport = require("passport");

class UserController {
    create(req, res) {
        const Users = new User({
            email: req.body.email,
            username: req.body.username,
            surname: req.body.surname,
            name: req.body.name,
            phone: req.body.phone,
        });

        User.register(Users, req.body.password, async (err, user) => {
            if (err) {
                res.send({ success: false, message: err });
            } else {
                try {
                    const Accounts = new Account({
                        owner: user.id,
                    });

                    await Accounts.save((error) => {
                        if (error) {
                            res.send({ error });
                        }
                    });

                    await passport.authenticate("local", (err, user) => {
                        if (err) {
                            res.send({ success: false, message: "error in auth" });
                        } else {
                            try {
                                req.login(user, (err) => {
                                    if (!err) {
                                        user.account = Accounts._id;
                                        user.save();
                                        res.send({ success: true, redirect: true, user });
                                    } else {
                                        res.send({ success: false, message: "error in auth" });
                                    }
                                });
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    })(req, res);
                } catch (e) {
                    res.send({ success: false, message: "error in auth" });
                }
            }
        });
    }
}

module.exports = new UserController();
