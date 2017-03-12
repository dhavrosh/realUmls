import mongoose from 'mongoose';
import ChatRoom from '../../models/ChatRoom';

export default function save(req, [id]) {
  return new Promise((resolve, reject) => {
    const saveChatRoom = async () => {
        const userId = req.user._id;
        const roomId = id || mongoose.Types.ObjectId();
        const update = { ...req.body, creator: userId };
        const options = { new: true, upsert: true };
        const chatRoom = await ChatRoom.findByIdAndUpdate(roomId, update, options);

        resolve(chatRoom);
    };

    saveChatRoom().catch(reject);
  });
}