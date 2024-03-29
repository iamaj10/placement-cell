const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true, // allows setting the first argument as req
    },
    async function (req, email, password, done) {
      try {
        // Find a user and establish the identity
        const user = await User.findOne({ email });

        if (!user) {
          req.flash("error", "Invalid Username or Password");
          return done(null, false);
        }

        // Match the password
        const isPasswordCorrect = await user.isValidatedPassword(password);

        if (!isPasswordCorrect) {
          req.flash("error", "Invalid Username or Password");
          return done(null, false);
        }

        // Authentication successful
        return done(null, user);
      } catch (err) {
        console.error("Error in local strategy authentication:", err);
        req.flash("error", "Authentication error. Please try again.");
        return done(err);
      }
    }
  )
);
// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key it the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log("Error in finding user ---> Passport");
    done(err);
  }
});

// check if user authenticated (middleware)
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
