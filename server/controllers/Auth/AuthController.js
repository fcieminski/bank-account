const User = require("../../models/User");
const passport = require("passport");

class AuthController {
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
                    passport.authenticate("local", (err, user) => {
                        if (err) {
                            res.send({ success: false, message: "error in auth" });
                        } else {
                            try {
                                req.login(user, (err) => {
                                    if (!err) {
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

    async signIn(req, res) {
        if (!req.body.username) {
            res.json({ success: false, message: "Username was not given" });
        } else if (!req.body.password) {
            res.json({ success: false, message: "Password was not given" });
        } else {
            passport.authenticate("local", (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    try {
                        req.login(user, (err) => {
                            if (!err) {
                                res.send({ success: true, redirect: true, user });
                                req.session.save()
                            } else {
                                res.json({ success: false, message: err });
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
            })(req, res);
        }
    }

    isAuth(req, res) {
        if (req.isAuthenticated()) {
            res.send({
                user: req.user,
            });
        } else {
            res.status(403).send({
                error: "not Authorized",
            });
        }
    }
}

module.exports = new AuthController();
