import User from '../../models/User';

export default function load(req, [input]) {
  return new Promise((resolve, reject) => {
    const findUsers = async () => {
      const users = await User.find({
        email : { $regex: new RegExp(input), $options: 'i' }
      }).select('-_id email username');

      resolve(users);
    };

    findUsers().catch(reject);
  });
}