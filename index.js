// Import required modules and configurations
const dbConfig = require("./config/database");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const port = 8001;
const expressLayouts = require("express-ejs-layouts");

// Used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

// MongoDB store for session
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

// Connect to the MongoDB database
dbConfig.connect();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);

// Set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Configure session
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
      // Replace this URL with your MongoDB Atlas connection string
      mongoUrl:
        "mongodb+srv://dbUser:dbUserPassword@atlascluster.nesbr6t.mongodb.net/?retryWrites=true&w=majority",
      //in memory db
      // "mongodb://localhost:27017/placement_cell",
      autoRemove: "disabled",
    }),
    // Log any errors during setup
    function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

// Configure flash messages
app.use(flash());
app.use(customMware.setFlash);

// Use express router
app.use("/", require("./routes"));

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
