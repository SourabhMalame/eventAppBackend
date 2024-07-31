const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const eventRoute = require("./routes/eventRoute");
const accountRoute = require("./routes/accountRoute");
const organiserRoute = require("./routes/organiserRoute");
// const profileRoute = require("./routes/profileRoute");
const paymentRoute = require("./routes/paymentRoute")
const bankAccountRoutes = require("./routes/bankAccountRoutes")

const app = express();

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();


// Enable CORS
const corsOptions = {
    origin: "http://localhost:3500",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: "*",
};
app.use(cors(corsOptions));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v3/event", eventRoute);
app.use("/api/v3/account", accountRoute);
// app.use("/api/v3/organiser", organiserRoute);
// app.use("/api/v3/profile", profileRoute);
app.use("/api/v3/payment", paymentRoute);
app.use("/api/v3/bankAccounts", bankAccountRoutes);


module.exports = app;
