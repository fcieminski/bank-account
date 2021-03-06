const AuthController = require("../controllers/Auth/AuthController");
const AccountController = require("../controllers/AccountController");
const UserController = require("../controllers/UserController");
const CardsController = require("../controllers/CardsController");
const HistoryController = require("../controllers/HistoryController");
const PlannedTransferController = require("../controllers/PlannedTransferController");
const isAuthenticated = require("../middleware/AuthMiddleware");
const app = require("../config/app");
const multer = require("multer");
const WidgetsController = require("../controllers/WidgetsController");

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        const fileName =
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15);
        const extension = file.originalname.split(".").pop();
        cb(null, `${fileName}.${extension}`);
    },
});

const upload = multer({ storage, limits: { fileSize: 2097152 } });

app.post("/register", UserController.create);

app.post("/user", AuthController.isAuth);
app.post("/login", AuthController.signIn);
app.post("/logout", AuthController.logOut);

app.get("/user-accounts/:userId", AccountController.findAllUserAccounts);
app.get("/account/:userId", AccountController.findAccount);
app.get("/account/:accountId/stats", isAuthenticated, AccountController.getAccountStats);
app.post("/account/create", isAuthenticated, AccountController.createNewAccount);
app.post(
    "/account/:accountId/make-goal",
    (req, res, next) => {
        isAuthenticated(req, res, next);
    },
    (req, res, next) => {
        upload.single("file")(req, res, (error) => {
            if (error) return res.status(500).send({ error: "Plik jest za duży, maksymalny rozmiar to 2MB" });
            else next();
        });
    },
    (req, res) => {
        AccountController.createSavingGoal(req, res);
    }
);
app.delete("/account/:accountId/goal/:goalId/delete", isAuthenticated, AccountController.deleteGoal);
app.post("/account/:goalId/transfer-to-goal", isAuthenticated, AccountController.transferMoneyToGoal);
app.get("/account/:accountId/get-goals", isAuthenticated, AccountController.getCurrentGoals);

app.post("/create-new-card", isAuthenticated, CardsController.create);
app.patch("/update/:cardId", isAuthenticated, CardsController.updateCard);
app.post("/find-card/:userId", isAuthenticated, CardsController.findUserCards);
app.delete("/delete/:cardId", isAuthenticated, CardsController.delete);

app.post("/history/:userId", isAuthenticated, HistoryController.index);
app.post("/history/:userId/search", isAuthenticated, HistoryController.searchInHistory);
app.post("/add-to-history/:userId", isAuthenticated, HistoryController.makeTransfer);
app.get("/add-to-history/:userId/get-code", isAuthenticated, HistoryController.sendTransferCode);
app.post("/add-to-history/:userId/send-code", isAuthenticated, HistoryController.compareUserCode);
app.get("/pdf", HistoryController.getTransferPDF);

app.post("/make-planned/:userId", isAuthenticated, PlannedTransferController.create);
app.post("/get-planned/:userId", isAuthenticated, PlannedTransferController.index);
app.put("/update-planned/:transferId", isAuthenticated, PlannedTransferController.updateTransfer);
app.delete("/delete-planned/:transferId", isAuthenticated, PlannedTransferController.deleteTransfer);

app.post("/make-widget", isAuthenticated, WidgetsController.create);
app.get("/get-widgets/:userId", isAuthenticated, WidgetsController.index);
app.delete("/delete-widget/:widgetId", isAuthenticated, WidgetsController.delete);
