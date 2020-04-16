const User = require("../models/User");
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

        User.register(Users, req.body.password, (err, user) => {
            if (err) {
                res.send({ data: { success: false, message: err } });
            } else {
                passport.authenticate("local-mongoose", req, res);
                res.send({ data: { success: true, redirect: true, user } });
            }
        });
    }

    isAuth(req, res) {
        if (req.isAuthenticated()) {
            res.send({
                user: req.user,
            });
        } else {
            res.send({
                error: "nope",
            });
        }
    }
}

module.exports = new UserController();
