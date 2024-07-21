const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const eventRoute = require("./routers/eventRoute");
const accountRoute = require("./routers/accountRoute");
const orginiserRoute = require("./routers/organiserRoute");
const profileRoute = require("./routers/profileRoute");

const app = express();

//Set security http header
app.use(helmet());

//Limit request from same api

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP,please try again after a hour",
});
app.use("/api", limiter);

//1)middleware
//middleware is used to access the req.body part in post method or while creating a new tour

//Body parser , reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// Data Sanitization against No SQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS

app.use(xss());

//Prevent parameter pollution

app.use(
  hpp({
    whitelist: ["duration"],
  })
);

//creating ur own middleware

app.use(compression());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: "*",
};

// ? Middleware

// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });

app.use(cors(corsOptions));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v3/event", eventRoute);
app.use("/api/v3/account", accountRoute);
app.use("/api/v3/organiser", orginiserRoute);
app.use("/api/v3/profile", profileRoute);

module.exports = app;
