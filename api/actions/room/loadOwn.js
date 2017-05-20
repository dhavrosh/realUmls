import Room from '../../models/Room';

export default function load(req) {
  return new Promise((resolve, reject) => {
    const loadOwnRoom = async () => {
      const user = req.user;
      const options = {creator: user._id};
      const roomIds = user.keys.map(key => key.room);
      let sharedRooms = [];

      const ownRooms = await Room.find(options);

      if (roomIds) {
        sharedRooms = await Room.find({'_id': {'$in': roomIds}});
      }

      resolve({
        own: ownRooms,
        shared: sharedRooms
      });
    };

    loadOwnRoom().catch(reject);
  });
}