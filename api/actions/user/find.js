import User from '../../models/User';

// TODO: prevent to find creator
export default function load(req, [input]) {
  return new Promise((resolve, reject) => {
    const findUsers = async () => {
      const creatorId = req.user._id;
      const users = await User.find({
        _id: { $ne: creatorId },
        email : { $regex: new RegExp(input), $options: 'i' }
      }).select('-_id email username');

      resolve(users);
    };

    findUsers().catch(reject);
  });
}