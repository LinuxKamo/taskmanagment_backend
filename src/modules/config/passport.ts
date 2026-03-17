// passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CALLBACK_LOGIN, GOOGLE_CALLBACK_REGISTER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../constants/env";

// Login strategy
passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_LOGIN,
      proxy: true,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        return done(null, {
          googleId: profile.id,
          email: profile.emails?.[0].value,
          name: profile.name?.givenName,
          surname: profile.name?.familyName,
        });
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// Register strategy
passport.use(
  "google-register",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_REGISTER,
      proxy: true,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        return done(null, {
          googleId: profile.id,
          email: profile.emails?.[0].value,
          name: profile.name?.givenName,
          surname: profile.name?.familyName,
        });
      } catch (err) {
        done(err, false);
      }
    }
  )
);

export default passport;
