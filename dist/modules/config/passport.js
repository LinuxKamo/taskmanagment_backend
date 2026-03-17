"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// passport.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("../constants/env");
// Login strategy
passport_1.default.use("google-login", new passport_google_oauth20_1.Strategy({
    clientID: env_1.GOOGLE_CLIENT_ID,
    clientSecret: env_1.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.GOOGLE_CALLBACK_LOGIN,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        return done(null, {
            googleId: profile.id,
            email: profile.emails?.[0].value,
            name: profile.name?.givenName,
            surname: profile.name?.familyName,
        });
    }
    catch (err) {
        done(err, false);
    }
}));
// Register strategy
passport_1.default.use("google-register", new passport_google_oauth20_1.Strategy({
    clientID: env_1.GOOGLE_CLIENT_ID,
    clientSecret: env_1.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.GOOGLE_CALLBACK_REGISTER,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        return done(null, {
            googleId: profile.id,
            email: profile.emails?.[0].value,
            name: profile.name?.givenName,
            surname: profile.name?.familyName,
        });
    }
    catch (err) {
        done(err, false);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map