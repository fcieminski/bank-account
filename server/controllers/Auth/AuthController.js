const passport = require("passport");

class AuthController {
    async signIn(req, res) {
        if (req.body.username && req.body.password) {
            passport.authenticate("local", (err, user) => {
                if (err) {
                    res.json({ success: false, message: "Problem z autentykacją" });
                } else {
                    try {
                        req.login(user, (err) => {
                            if (!err) {
                                res.send({ success: true, redirect: true, user });
                            } else {
                                res.json({ success: false, message: "Niepoprawne hasło lub login" });
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
            })(req, res);
        }
    }

    logOut(req, res) {
        req.logout();
        res.send({ redirect: true });
    }

    isAuth(req, res) {
        if (req.isAuthenticated()) {
            res.send({
                user: req.user,
                authenticated: req.isAuthenticated(),
            });
        } else {
            res.status(403).send({
                error: "not Authorized",
            });
        }
    }
}

module.exports = new AuthController();
