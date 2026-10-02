const { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID } = require("../env");
const { Strategy } = require("passport-facebook");
const { findOrCreateOauthUser } = require("../../services/oauth.service");
const registerDevice = require("../..services/device.service");

new Strategy(
  {
    // tokenURL: "",
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4002/auth/facebook/call",
    profileFields: [
      "id",
      "emails",
      "firstName",
      "lastName",
      "profile.type(large)",
    ],
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOauthUser({
        oauthProvider: "facebook",

        email: profile.emails?.[0]?.value,

        providerId: profile.id,

        avatar: profile.photos?.[0]?.value,

        firstName: profile.name?.givenName,

        lastName: profile.name?.familyName,

        accessToken: accessToken,

        refreshToken: refreshToken,
      });

      await registerDevice(user);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  },
);
