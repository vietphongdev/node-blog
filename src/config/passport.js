import passportLocal from "passport-local";
import User from "../models/UserModel";
import {
  INVALID_EMAIL,
  INVALID_PASSWORD,
  LOGIN_SUCCESS,
} from "./../constants/messages";
import bcrypt from "bcryptjs";

const LocalStrategy = passportLocal.Strategy;

const passportConfig = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        User.findOne({ email: email }).then((user) => {
          if (!user) {
            return done(null, false, req.flash("error-message", INVALID_EMAIL));
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return err;
            }

            if (!isMatch) {
              return done(
                null,
                false,
                req.flash("error-message", INVALID_PASSWORD)
              );
            }

            return done(
              null,
              user,
              req.flash("success-message", LOGIN_SUCCESS)
            );
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

export default passportConfig;
