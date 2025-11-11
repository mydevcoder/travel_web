if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
// const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const Path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErrors = require("./utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("./schema.js");
// const wrapAsync = require("./utils/WrapAsync.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const mapRoutes = require("./routes/map");
require('dotenv').config();


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const mongo_url = "mongodb://127.0.0.1:27017/wanderlist";
const mongo_url = process.env.MONGO_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "views"));
app.use(express.static(Path.join(__dirname, "/public")));
app.use(express.json());
// server.js (or app.js)
app.use(express.urlencoded({ extended: true })); // parses form data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: mongo_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("SESSION STORE ERROR", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let demo = new User({
//     email: "student@email.com",
//     username : "student",
//   });
//   let registeredUser = await User.register(demo,"helloworld");
//   res.send(registeredUser);
// })

// app.get(
//   "/",async (req, res) => {
//     res.send("Hello I am root!");
//   });

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.all("*", (req, res, next) => {
//   next(new ExpressErrors(404, "Page Not Found!"));
// });
// app.use((err, req, res, next) => {
//   console.log(err.name);
//   next(err);
// });

// app.get("/admin", (req, res) => {
//   throw new ExpressErrors(403, "You are not an admin!");
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

// app.use((err, req, res, next) => {
//   const { statusCode = 500 } = err;
//   if (!err.message) err.message = "Something went wrong!";
//   res.status(statusCode).render("error.ejs", { statusCode, message: err.message });
// });

app.use("/map", mapRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
