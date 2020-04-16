const TestController = require("../controllers/TestController");
const UserController = require("../controllers/UserController");
const app = require('../config/app');

app.post("/register", UserController.create);
app.post("/user", UserController.isAuth);

app.get("/tests", TestController.index);
app.put("/tests/:id", TestController.update);
app.get("/tests/:id", TestController.find);
app.post("/tests", TestController.createTest);