const express = require("express");
const cors = require("cors");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const helmet = require("helmet");
const connectPgSimple = require("connect-pg-simple");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { detectDevice } = require("./middlewares/detectDevice");

// OTHER IMPORTS
const {
  PORT,
  BASE_URL,
  NODE_ENV,
  SESSION_SECRET,
  DATABASE_URL,
  CLIENT_URL,
} = require("./config/env");
const cartRouter = require("./routes/cart.routes.js");
const sequelize = require("./database/db");
const authRouter = require("./routes/auth.route.js");
const homeRouter = require("./routes/home.route");
const limiter = require("./middlewares/limitRate");
const adminRouter = require("./routes/admin.route.js");

const app = express();
const port = PORT || 4000;

app.enable("trust proxy");
if (Array.isArray()) {
}

const pgSimple = connectPgSimple(session);
const store = new pgSimple({
  connectString: DATABASE_URL,
  tableName: "user_sessions",
  createTableIfMissing: true,
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");

  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    store: store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.set("trust proxy", 1);
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

app.use(limiter);

app.use((req, res, next) => {
  res.locals.rateLimit = {
    remaining: limiter.resetTime - Date.now(),
    limit: limiter.max,
  };
  next();
});

app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
  }),
);
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  return next();
});

// FOR SOCIAL LOGIN
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   csrfProtection;
//   res.locals.csrfProtection = req.csrfToken();

//   next();
// });

const hasAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

app.use(detectDevice);

// ALL ROUTES    limiter,
app.use("/api/carts", cartRouter);
app.use("/api", homeRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    scope: ["user:email"],
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    res.redirect("/api/home/");
    req.flash("success_msg", "You have been logged in successfully!");
  },
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    res.redirect("/api/home/");
    req.flash("success_msg", "You have been logged in successfully!");
  },
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    scope: ["profile", "email"],
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    res.redirect("/api/home/");
    req.flash("success_msg", "You have been logged in successfully!");
  },
);

// LOGOUT

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database is syncing!");
    app.listen(port, () => {
      console.log(`App is running on port localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(`Server is not responding: ${err}`);
  });
