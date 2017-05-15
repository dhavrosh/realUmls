import Room from '../../models/Room';

export default function remove(req, [id]) {
  return new Promise((resolve, reject) => {
    const removeRoom = async () => {
      const room = await Room.findById(id);

      await room.remove();

      resolve(room);
    };

    if (id) {
      removeRoom().catch(reject);
    } else reject('Id is required');
  });
}