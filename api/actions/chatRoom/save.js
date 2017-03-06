import ChatRoom from '../../models/ChatRoom';

export default function save(req) {
  return new Promise((resolve, reject) => {
    const saveChatRoom = async () => {
        const userId = req.user._id;
        const chatRoom = await ChatRoom.create({ ...req.body, creator: userId});

        resolve(chatRoom);
    };

    saveChatRoom().catch(reject);
  });
}