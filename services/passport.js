const passport = require('passport');
const GoolgeStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const util = require('util');

const csObj = (obj, type = 'log', str) => console[type](str, util.inspect(obj));
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

passport.use(
  new GoolgeStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      csObj(profile, 'info', 'profile');
      User.findOne({
        googleID: profile.id
      }).then(
        existUser => {
          if (existUser) done(null, existUser);
          else
            new User({ googleID: profile.id })
              .save()
              .then(user => done(null, user), err => console.error(err));
        },
        err => console.error(err)
      );
    }
  )
);
