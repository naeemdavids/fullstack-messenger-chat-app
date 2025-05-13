import { config } from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

config(); // Load environment variables from .env file.

//The following code is for the Google and Github login.

//1)Google.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // From Google Console.
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (profile, done) => {
      try {
        // Find or create user, extract email & display name.
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // Use Google’s photo or fall back to default
          const photoUrl =
            (profile.photos && profile.photos[0]?.value) ||
            "/defaultAvatar.jpg";

          // Generate a random password for record (won’t be used).
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(profile.id, salt);
          user = await User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            password: hashed,
            profilePic: photoUrl,
            isAdmin: false,
          });
        }
        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

//2)GitHub.
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
      scope: ["user:email"], // request email.
    },
    async (profile, done) => {
      try {
        // Grab the first email GitHub gives you.
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
          return done(new Error("GitHub did not return an email"), null);
        }

        // Find or create.
        let user = await User.findOne({ email });
        if (!user) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(profile.id, salt);
          user = await User.create({
            fullName: profile.displayName || profile.username,
            email,
            password: hash, // dummy.
            profilePic: profile.photos?.[0]?.value || "/defaultAvatar.jpg",
            isAdmin: false,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
