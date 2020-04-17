const User = require("../../models/User");

class AuthController {
    create(req, res) {
        const Users = new User({
            email: req.body.email,
            username: req.body.username,
            surname: req.body.surname,
            name: req.body.name,
            phone: req.body.phone,
        });

        User.register(Users, req.body.password, (err, user) => {
            if (err) {
                res.send({ data: { success: false, message: err } });
            } else {
                res.send({ data: { success: true, redirect: true, user } });
            }
        });
    }

    async doLogin(req, res) {
        if (!req.body.username) {
            res.json({ success: false, message: "Username was not given" });
        } else {
            if (!req.body.password) {
                res.json({ success: false, message: "Password was not given" });
            } else {
                passport.authenticate("local", function (err, user, info) {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {
                        try {
                            req.login(user, (err) => {
                                console.log(err, user, req.isAuthenticated());
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    }
                })(req, res);
            }
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
