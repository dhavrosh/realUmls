import constants from '../../constants';
import Room from '../../models/Room';
import Role from '../../models/Role';
import Resource from '../../models/Resource';
import Permission from '../../models/Permission';

export default function load(req, [id]) {
  return new Promise((resolve, reject) => {
    const loadRoom = async() => {
      if (id) {
        const room = await Room.findById(id).select('-__v').lean();

        if (room) {

          if (!room.isVisible) {
            const user = req.user;
            let permission = undefined;

            if (user) {
              const creator = user._id == room.creator;

              if (creator) {
                const options = {title: constants.roles.creator};
                const creator = await Role.findOne(options).select('-title').lean();

                permission = await getMemberPermission(creator._id);
              } else {
                const member = room.members.find(getEmailComparator(user.email));

                if (member) {
                  permission = await getMemberPermission(member.role);
                }
              }
            } else {
              const {e: email} = req.query;

              if (email) {
                const member = room.members.find(getEmailComparator(email));

                if (member) {
                  permission = await getMemberPermission(member.role);
                }
              }
            }

            if (permission) {
              resolve({room, permission});
            } else {
              reject({status: 401, message: 'Permission denied'});
            }
          } else {

          }
        } else {
          reject({status: 400, message: 'Room not found'});
        }
      } else reject({status: 401, message: 'Id is required'});
    };

    loadRoom().catch(reject);
  });
}

function getEmailComparator(email) {
  return item => item.email === email;
}

async function getMemberPermission(role) {
  const title = constants.resources.chat;
  const resource = await Resource.findOne({title}).lean();
  const options = {role, resource: resource._id};

  return await Permission.findOne(options).select('-_id -__v -resource').lean();
}