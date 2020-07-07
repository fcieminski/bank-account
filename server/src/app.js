require("../config/mongoose");
require("../routes/api");
require("../config/agenda");
const app = require("../config/app");

app.listen(process.env.PORT || 8081);
