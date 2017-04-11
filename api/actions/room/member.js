import constants from '../../constants';
import ChatRoom from '../../models/Room';
import Resource from '../../models/Resource';
import Permission from '../../models/Permission';

export default function member(req, [id]) {
  return new Promise((resolve, reject) => {
    const loadMember = async () => {
      if (id) {
        if (req.user) {
          // TODO
        } else {
          const { e: email } = req.query;

          if (email) {
            const chatRoom = await ChatRoom.findById(id).lean();
            const member = chatRoom.members.find(member => member.email === email);

            if (member) {
              const title = constants.resources.chat;
              const resource = await Resource.findOne({ title }).lean();
              const options = { role: member.role, resource: resource._id };

              const memberPermissions = await Permission.findOne(options);
              resolve(memberPermissions);
            } else reject('Member not found');
          } else reject('Email is required');
        }
      } else reject('Id is required');
    };

    loadMember().catch(reject);
  });
}