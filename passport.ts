import { PassportStatic } from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User, { IUser } from "./models/userModel";

type DoneFunction = (error: any, user?: any) => void;

export const configurePassport = (passport: PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "272723823718-q8v0t7si7mjqht3f4nsneg5c85d2gefn.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/api/auth/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: DoneFunction
      ) => {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || "",
          password: "", // Since Google doesn't provide a password, set it as empty or generate a random one
        };
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            user = await User.findOne({ email: newUser.email });
            if (user) {
              user.googleId = newUser.googleId;
              await user.save();
              return done(null, user);
            } else {
              user = new User(newUser);
              await user.save();
              return done(null, user);
            }
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as IUser).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
