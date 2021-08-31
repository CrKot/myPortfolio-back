import bcrypt from 'bcryptjs';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import dotenv from 'dotenv';
import errorMap from '../util/errorMap.js';

dotenv.config()
const JwtStrategy = passportJwt.Strategy
const LocalStrategy = passportLocal.Strategy

import User from '../models/User.js';

const tokenExtractor = (req) => {
  let token = null;

  if (req && req.headers && req.headers.authorization) {
    const rawToken = req.headers.authorization.toString();
    token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
  }
  return token
}

export default function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email })
          if (!user) {
            return done(null, false, errorMap.authorizationFailed )
          }

          const isPasswordCorrect = await bcrypt.compare(password, user.password)
          if(!isPasswordCorrect) {
            return done(null, false, errorMap.authorizationFailed )
          }
          return done(null, user)
        }
        catch(err) {
            done(err)
        }
      }
      )
    );

  passport.use(
    new JwtStrategy({
      jwtFromRequest: tokenExtractor,
      secretOrKey: process.env.SESSION_SECRET
    },
    function (jwtPayload, done) {

      return User.findOne({ email: jwtPayload.email })
        .then((user) => {
          if (user) {
            return done(null, {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              id: user._id
            })
          } else {
            return done(null, false, 'Failed')
          }
        })
        .catch((err) => {
          return done(err)
        })
    }
  ));

  passport.serializeUser((user, done) => {
    return done(null, user.id)}
  )

  passport.deserializeUser((id, done) => {
  User.findOne({ _id: id })
    .then(user => {
      const userInformation = {
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user._id
        }
      }

      return done(null, userInformation)
    })
    .catch(err => {
      if (err) throw err
    })
  });
}