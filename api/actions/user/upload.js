import User from '../../models/User';

export default function upload(req) {
  return new Promise((resolve, reject) => {
    const uploadAvatar = async () => {
      const user = req.user;

      if (user) {

        resolve('Hey');
      } else reject('Authentication is required');
    };

    uploadAvatar().catch(reject);
  });
}