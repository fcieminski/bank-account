const TestController = require("../controllers/TestController");
const AuthController = require("../controllers/Auth/AuthController");
const app = require("../config/app");

app.post("/register", AuthController.create);
app.post("/user", AuthController.isAuth);
app.post("/login", AuthController.signIn);

app.get("/tests", TestController.index);
app.put("/tests/:id", TestController.update);
app.get("/tests/:id", TestController.find);
app.post("/tests", TestController.createTest);
