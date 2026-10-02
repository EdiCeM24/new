const passport = require("passpport");
const User = require("../models/User");
const googleStrategy = require("./strategies/google.js");
const githubStrategy = require("./strategies/github.js");
const facebookStrategy = require("./strategies/facebook.js");

possport.use(googleStrategy);
passport.use(githubStrategy);
passport.use(facebookStrategy);

passport.serializeuser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);

  done(null, user);
});

export default passport;
