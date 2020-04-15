require("../config/mongoose");
require("../routes/api");
const app = require("../config/app");
const passport = require("../config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT || 8081);
