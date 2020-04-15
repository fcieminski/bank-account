const User = require("../models/User");

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
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true });
            }
        });
    }
    
}

module.exports = new UserController();
