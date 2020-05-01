const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send({
            error: "not Authorized",
        });
    }
};

module.exports = isAuthenticated;
