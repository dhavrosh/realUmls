import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import User from '../actions/auth/User';

const configure = (app, config) => {

  function addJWT(user){
    const token = jwt.sign(
      { email: user.email }, config.jwtSecret, { expiresIn: 60000 }
    );

    return Object.assign({}, user.toJSON(), {token});
  }

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('login', new LocalStrategy({
      usernameField: 'email'
    },
    function (username, password, done) {
      const findUser = async () => {
        const user = await User.findOne({ email: username });

        if (!user) return done(null, null, 'User not found');

        if (user.comparePassword(password)) {
          done(null, addJWT(user));
        }
        else {
          done(null, null, `Bad password`);
        }
      };

      findUser().catch(done);
    }
  ));

  passport.use('signup', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      const redisterUser = async () => {
          const user = await User.findOne({ email: username });

          if (user) {
            return done(null, null, 'User already exists');
          } else {
            const newUser = await User.create(req.body);

            return done(null, addJWT(newUser));
          }
      };

      redisterUser().catch(done);
  }));

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
      User.findById(id, done);
  });
};

export default configure;