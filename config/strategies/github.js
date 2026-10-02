const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require("../env");
const { Strategy } = require("passport-github2");
const { findOrCreateOauthUser } = require("../../services/oauth.service");
const registerDevice = require("../..services/device.service");

//
new Strategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    proxy: true,
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOauthUser({
        oauthProvider: "github",

        providerid: profile.id,

        firstName: profile.name?.firstName,

        lastName: profile.name?.lastName,

        email: profile.emails?.[0]?.value,

        avatar: profile.photos?.[0]?.value,

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
