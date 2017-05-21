import User from '../../models/User';

export default function save(req) {
  return new Promise((resolve, reject) => {
    const saveUser = async () => {
      const user = req.user;
      const data = req.body;

      if (user) {
        if (data.newPassword !== '') {
          if (user.comparePassword(data.oldPassword)) {
            user.password = data.newPassword;
          } else reject('Wrong old password, please try again');
        }

        user.username = data.username;

        await user.save();

        resolve(user);
      } else reject('Authentication is required');
    };

    saveUser().catch(reject);
  });
}