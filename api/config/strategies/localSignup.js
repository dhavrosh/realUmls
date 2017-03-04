import User from '../../models/User';

export default function localSignup(req, username, password, done) {
  const registerUser = async () => {
    const user = await User.findOne({ email: req.body.email });
    const username = await User.findOne({ username: req.body.username });

    if (user) {
      return done(null, null, 'User already exists');
    } else if (username) {
      return done(null, null, 'Username already taken');
    } else {
      const newUser = await User.create(req.body);
      return done(null, newUser);
    }
  };

  registerUser().catch(done);
}