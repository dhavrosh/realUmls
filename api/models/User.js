import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const KeySchema = new mongoose.Schema({
  room: { type: String, required: true },
  value: { type: String, required: true }
});

// TODO: save user image
const UserSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true },
  password: { type: String, required: true },
  keys: [KeySchema],
  provider: String,
  profileId: String,
});

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

export const Key = mongoose.model('Key', KeySchema);
export default mongoose.model('User', UserSchema);