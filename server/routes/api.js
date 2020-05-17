const TestController = require("../controllers/TestController");
const AuthController = require("../controllers/Auth/AuthController");
const AccountController = require("../controllers/AccountController");
const UserController = require("../controllers/UserController");
const CardsController = require("../controllers/CardsController");
const HistoryController = require("../controllers/HistoryController");
const isAuthenticated = require("../middleware/AuthMiddleware");
const app = require("../config/app");

app.post("/register", UserController.create);

app.post("/user", AuthController.isAuth);
app.post("/login", AuthController.signIn);
app.post("/logout", AuthController.logOut);

app.get("/user-accounts/:userId", AccountController.findAllUserAccounts);
app.get("/account/:userId", AccountController.findAccount);

app.post("/create-new-card", isAuthenticated, CardsController.create);

app.post("/history/:userId", isAuthenticated, HistoryController.index);
app.post("/add-to-history/:userId", isAuthenticated, HistoryController.makeTransfer);
app.get("/add-to-history/:userId/get-code", isAuthenticated, HistoryController.sendTransferCode);
app.post("/add-to-history/:userId/send-code", isAuthenticated, HistoryController.compareUserCode);

// app.get("/tests", TestController.index);
// app.put("/tests/:id", TestController.update);
// app.get("/tests/:id", TestController.find);
// app.post("/tests", TestController.createTest);
