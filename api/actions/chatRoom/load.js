import ChatRoom from '../../models/ChatRoom';

export default function load(req, [id]) {
  return new Promise((resolve, reject) => {
    const loadChatRoom = async () => {
      const userId = req.user._id;
      const options = { creator: userId };

      if (id) {
        options._id = id;
      }

      const chatRoom = await ChatRoom.find(options);

      resolve(chatRoom);
    };

    loadChatRoom().catch(reject);
  });
}