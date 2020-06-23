const AuthController = require("../controllers/Auth/AuthController");
const AccountController = require("../controllers/AccountController");
const UserController = require("../controllers/UserController");
const CardsController = require("../controllers/CardsController");
const HistoryController = require("../controllers/HistoryController");
const PlannedTransferController = require("../controllers/PlannedTransferController");
const isAuthenticated = require("../middleware/AuthMiddleware");
const app = require("../config/app");
const multer = require("multer");

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        const uniqueSuffix = Date.now();
        const name = file.originalname.split(".").shift();
        const extension = file.originalname.split(".").pop();
        cb(null, `${name}-${uniqueSuffix}.${extension}`);
    },
});

const upload = multer({ storage });

app.post("/register", UserController.create);

app.post("/user", AuthController.isAuth);
app.post("/login", AuthController.signIn);
app.post("/logout", AuthController.logOut);

app.get("/user-accounts/:userId", AccountController.findAllUserAccounts);
app.get("/account/:userId", AccountController.findAccount);
app.get("/account/:accountId/stats", isAuthenticated, AccountController.getAccountStats);
app.post("/account/create", isAuthenticated, AccountController.createNewAccount);
app.post("/account/:accountId/make-goal", isAuthenticated, upload.single("file"), AccountController.createSavingGoal);
app.get("/account/:accountId/get-goals", isAuthenticated, AccountController.getCurrentGoals);

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
app.post("/get-planned/:userId", isAuthenticated, PlannedTransferController.index);
app.put("/update-planned/:transferId", isAuthenticated, PlannedTransferController.updateTransfer);
app.delete("/delete-planned/:transferId", isAuthenticated, PlannedTransferController.deleteTransfer);
