import mongoose from 'mongoose';
import User from '../../models/User';

export default function socialLogin(req, token, refreshToken, profile, done) {
  const findOrCreateSocialUser = async() => {
    if (profile) {
      let user = await User.findOne({
        email: profile.emails[0].value
      });

      if (!user) {
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          provider: profile.provider,
          profileId: profile.id,
          password: mongoose.Types.ObjectId(),
        });
      }

      req.logIn(user, err => err ? done(err) : done(null, user));
    }
  };

  findOrCreateSocialUser().catch(done);
}