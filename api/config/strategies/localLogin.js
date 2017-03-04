import User from '../../models/User';

export default function localLogin(username, password, done) {
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