import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import config from '../../src/config';
import * as strategies from './strategies';

const configure = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, strategies.login));
  passport.use('signup', new LocalStrategy({ passReqToCallback : true }, strategies.signup));
  passport.use(new FacebookStrategy({
      ...config.auth.strategies.facebook,
      callbackURL     : '/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'displayName'],
      passReqToCallback: true
    }, strategies.social));

  passport.use(new GoogleStrategy({
    ...config.auth.strategies.google,
    callbackURL     : '/api/auth/google/callback',
    profileFields: ['id', 'emails', 'name', 'displayName'],
    passReqToCallback: true
  }, strategies.social));

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/loginSuccess', failureRedirect : '/login'
  }));
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/loginSuccess', failureRedirect : '/login'
  }));
};

export default configure;