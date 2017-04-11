import Room from '../../models/Room';

export default function load(req) {
  return new Promise((resolve, reject) => {
    const loadOwnRoom = async () => {
      const userId = req.user._id;
      const options = { creator: userId };

      const room = await Room.find(options);

      resolve(room);
    };

    loadOwnRoom().catch(reject);
  });
}