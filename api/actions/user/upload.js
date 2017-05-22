import User from '../../models/User';

export default function upload(req) {
  return new Promise((resolve, reject) => {
    const uploadAvatar = async () => {
      const user = req.user;

      console.log(req);

      if (user) {
        if (req.file) {
          let imageSrc = req.file.destination + req.file.filename;

          imageSrc = imageSrc.split("/");
          imageSrc.shift();
          imageSrc = imageSrc.join("/");

          user.imageUrl = imageSrc;

          const updatedUser = await user.save();

          resolve(updatedUser);
        } else {

        }

      } else reject('Authentication is required');
    };

    uploadAvatar().catch(reject);
  });
}