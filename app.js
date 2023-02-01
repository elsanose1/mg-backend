const express = require("express");
const path = require("path");
const morgan = require("morgan");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helemt = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRouter");
const areaRouter = require("./routes/areaRouter");
const schoolRouter = require("./routes/schoolRouter");
const storeRouter = require("./routes/storeRouter");
const clientRouter = require("./routes/clientRouter");

const app = express();

// Golbal Midlleware
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// serving static files

app.use(express.static(path.join(__dirname, "public")));

// security HTTP headders
app.use(
  helemt({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      allowOrigins: ["*"],
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["*"],
        scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
      },
    },
  })
);

app.use(cors());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// limit requests per IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "to many requests from this IP , please try again in an hour",
});

app.use("/api", limiter);

// body parser
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(cookieParser());

// Data sanitization from Nosql query injection &&  XSS
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Handle Routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/areas", areaRouter);
app.use("/api/v1/schools", schoolRouter);
app.use("/api/v1/stores", storeRouter);
app.use("/api/v1/clients", clientRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(errorHandler);

module.exports = app;
