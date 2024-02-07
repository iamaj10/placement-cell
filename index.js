require("./config/database").connect();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const port = 8001;
const expressLayouts = require("express-ejs-layouts");

// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(expressLayouts);

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "placement-cell",
    secret: "12345",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://dbUser:dbUserPassword@atlascluster.nesbr6t.mongodb.net/?retryWrites=true&w=majority",
      //in memory db
      // "mongodb://localhost:27017/placement_cell",
      autoRemove: "disabled",
    }),
    function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`server is running on port: ${port}`);
});
