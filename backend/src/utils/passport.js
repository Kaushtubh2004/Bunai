import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/user.models.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://bunai-bgja.onrender.com/api/v1/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
        }

        return done(null, user); // pass user to controller
      } catch (error) {
        console.log("Passport Google Error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
