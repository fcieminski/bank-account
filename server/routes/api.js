const AuthController = require("../controllers/Auth/AuthController");
const AccountController = require("../controllers/AccountController");
const UserController = require("../controllers/UserController");
const CardsController = require("../controllers/CardsController");
const HistoryController = require("../controllers/HistoryController");
const PlannedTransferController = require("../controllers/PlannedTransferController");
const isAuthenticated = require("../middleware/AuthMiddleware");
const app = require("../config/app");

app.post("/register", UserController.create);

app.post("/user", AuthController.isAuth);
app.post("/login", AuthController.signIn);
app.post("/logout", AuthController.logOut);

app.get("/user-accounts/:userId", AccountController.findAllUserAccounts);
app.get("/account/:userId", AccountController.findAccount);

app.post("/create-new-card", isAuthenticated, CardsController.create);
app.patch("/update/:cardId", isAuthenticated, CardsController.updateCard);
app.post("/find-card/:userId", isAuthenticated, CardsController.findUserCards);

app.post("/history/:userId", isAuthenticated, HistoryController.index);
app.post("/history/:userId/search", isAuthenticated, HistoryController.searchInHistory);
app.post("/add-to-history/:userId", isAuthenticated, HistoryController.makeTransfer);
app.get("/add-to-history/:userId/get-code", isAuthenticated, HistoryController.sendTransferCode);
app.post("/add-to-history/:userId/send-code", isAuthenticated, HistoryController.compareUserCode);
app.get("/pdf", HistoryController.getTransferPDF);

app.post("/make-planned/:userId", isAuthenticated, PlannedTransferController.create);
