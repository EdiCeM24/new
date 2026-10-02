const { Strategy } = require("passport-google-oauth20");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../env");
const { findOrCreateOAuthUser } = require("../../services/oauth.service");
const registerDevice = require("../..services/device.service");

//
new Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,

    clientSecret: GOOGLE_CLIENT_SECRET,

    callbackURL: "/auth/google/callback",

    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    done(null, profile);

    try {
      const user = await findOrCreateOAuthUser({
        oauthProvider: "google",

        providerId: profile.id,

        email: profile.emails[0].value,

        avatar: profile.photos[0]?.value,

        firstName: profile.name.givenName,

        lastName: profile.name.familyName,

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
