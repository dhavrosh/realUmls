import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../actions/auth/User';

const configure = app => {

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
          done(null, user);
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

            return done(null, newUser);
          }
      };

      redisterUser().catch(done);
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

export default configure;