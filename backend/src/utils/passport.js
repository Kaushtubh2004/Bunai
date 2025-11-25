import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import {User} from "../models/user.models.js";

passport.use(new GoogleStrategy({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://bunai-bgja.onrender.com/api/v1/users/google/callback",
    scope: ['profile','email']
},
 async function( profile, done) {
    try {
        console.log(profile);
        
        
        let user = await User.findOne({ googleId: profile.id });

    
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                
            });
            await user.save();
        }

        
        return done(null, user);
    } catch (error) {
        return done(error, false); 
    }
}
));

// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });



// passport.deserializeUser(async(id, done) => {
//     try {
//         const user = await User.findById(id); 
//         done(null, user); 
//     } catch (error) {
//         done(error, null);
//     }
// });


export default passport;