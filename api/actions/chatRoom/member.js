import ChatRoom from '../../models/ChatRoom';

export default function load(req, [id, email]) {
  return new Promise((resolve, reject) => {
    const getMember = async () => {
      if (!id || !email) {
        reject('Id and email are required');
      }

      const chatRoom = await ChatRoom.findById(id).select('-_id members').lean();
      const member = chatRoom.members.find(member => member.email === email);

      // TODO: add to member permissions

      if (member) resolve(member);
      else reject('Member not found');
    };

    getMember().catch(reject);
  });
}