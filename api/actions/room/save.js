import mongoose from 'mongoose';
import Room from '../../models/Room';

export default function save(req, [id]) {
  return new Promise((resolve, reject) => {
    const saveRoom = async () => {
        const userId = req.user._id;
        const roomId = id || mongoose.Types.ObjectId();
        const update = { ...req.body, creator: userId };
        const options = { new: true, upsert: true };
        const room = await Room.findByIdAndUpdate(roomId, update, options);

        resolve(room);
    };

    saveRoom().catch(reject);
  });
}