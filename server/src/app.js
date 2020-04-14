const mongoose = require("mongoose");
const app = require('../routes/api')


mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/bank-account", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("DB Connected!"))
    .catch((err) => {
        console.log(`DB Connection Error: ${err.message}`);
    });

app.listen(process.env.PORT || 8081);
