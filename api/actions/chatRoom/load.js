import ChatRoom from '../../models/ChatRoom';

export default function load(req) {
  return new Promise((resolve, reject) => {
    const loadChatRoom = async () => {
      const userId = req.user._id;
      const chatRoom = await ChatRoom.find({ creator: userId });

      resolve(chatRoom);
    };

    loadChatRoom().catch(reject);
  });
}