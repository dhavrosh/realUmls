import constants from '../../constants';
import Room from '../../models/Room';
import Resource from '../../models/Resource';
import Permission from '../../models/Permission';

export default function load(req, [id]) {
  return new Promise((resolve, reject) => {
    const loadRoom = async () => {
      if (id) {
        const room = await Room.findById(id).select('-__v').lean();
        let permission = undefined;

        if (req.user) {
          // TODO
        } else {
          const { e: email } = req.query;

          if (email) {
            const member = room.members.find(member => member.email === email);

            if (member) {
              const title = constants.resources.chat;
              const resource = await Resource.findOne({ title }).lean();
              const options = { role: member.role, resource: resource._id };

              permission = await Permission.findOne(options).select('-_id -__v -resource').lean();
            }
          }
        }

        resolve({ room, permission });
      } else reject('Id is required');
    };

    loadRoom().catch(reject);
  });
}