import ChatRoom from '../../models/ChatRoom';

export default function remove(req, [id]) {
  return new Promise((resolve, reject) => {
    const removeChatRoom = async () => {
      const chatRoom = await ChatRoom.findByIdAndRemove(id);

      resolve(chatRoom);
    };

    if (id) {
      removeChatRoom().catch(reject);
    } else reject('Id is required');
  });
}