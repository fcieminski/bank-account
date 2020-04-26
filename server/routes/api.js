const TestController = require("../controllers/TestController");
const AuthController = require("../controllers/Auth/AuthController");
const AccountController = require("../controllers/AccountController");
const UserController = require("../controllers/UserController");
const CardsController = require("../controllers/CardsController");
const app = require("../config/app");

app.post("/register", UserController.create);

app.post("/user", AuthController.isAuth);
app.post("/login", AuthController.signIn);

app.get("/account-owner", AccountController.find);

app.post("/create-new-card", CardsController.create);

app.get("/tests", TestController.index);
app.put("/tests/:id", TestController.update);
app.get("/tests/:id", TestController.find);
app.post("/tests", TestController.createTest);
