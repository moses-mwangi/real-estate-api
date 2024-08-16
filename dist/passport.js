"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userModel_1 = __importDefault(require("./models/userModel"));
const configurePassport = (passport) => {
    passport.use(new passport_google_oauth20_1.Strategy({
        clientID: "272723823718-q8v0t7si7mjqht3f4nsneg5c85d2gefn.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/api/auth/google/callback",
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            password: "", // Since Google doesn't provide a password, set it as empty or generate a random one
        };
        try {
            let user = await userModel_1.default.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            }
            else {
                user = await userModel_1.default.findOne({ email: newUser.email });
                if (user) {
                    user.googleId = newUser.googleId;
                    await user.save();
                    return done(null, user);
                }
                else {
                    user = new userModel_1.default(newUser);
                    await user.save();
                    return done(null, user);
                }
            }
        }
        catch (err) {
            console.error(err);
            return done(err, null);
        }
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel_1.default.findById(id);
            done(null, user);
        }
        catch (err) {
            done(err, null);
        }
    });
};
exports.configurePassport = configurePassport;
