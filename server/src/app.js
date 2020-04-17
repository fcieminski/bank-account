require("../config/mongoose");
require("../routes/api");
const app = require("../config/app");

app.listen(process.env.PORT || 8081);
