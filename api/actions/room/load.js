import constants from '../../constants';
import Room from '../../models/Room';
import Role from '../../models/Role';
import Resource from '../../models/Resource';
import Permission from '../../models/Permission';
import User from '../../models/User';

export default function load(req, [id]) {
  return new Promise((resolve, reject) => {
    const loadRoom = async() => {
      if (id) {
        const room = await Room.findById(id).select('-__v').lean();
        const {k: key} = req.query;

        if (room) {
          let permission;
          let authenticationRequired = false;
          let isAnonymRegistered = false;
          const user = req.user;

          if (user) {
            const creator = user._id == room.creator;

            if (creator) {
              const options = {title: constants.roles.creator};
              const creator = await Role.findOne(options).select('-title').lean();

              permission = await getMemberPermission(creator._id);
            } else {
              const key = user.keys.find(key => key.room == room._id);

              if (key) {
                const member = room.members.find(getKeyComparator(key.value));

                if (member) {
                  permission = await getMemberPermission(member.role);
                }
              }
            }
          } else {
            if (!room.isVisible && key) {
                authenticationRequired = true;
                isAnonymRegistered = await getUserWithKey(key);
            }

            permission = await getPermissionByKey(key, room.members);
          }

          if (permission) {
            resolve({
              room,
              permission,
              isAnonymRegistered,
              authenticationRequired
            });
          } else {
            reject({status: 401, message: 'Permission denied'});
          }
        } else {
          reject({status: 400, message: 'Room not found'});
        }
      } else reject({status: 401, message: 'Id is required'});
    };

    loadRoom().catch(reject);
  });
}

function getKeyComparator(key) {
  return item => item.key === key;
}

async function getPermissionByKey(key, members) {
  let permission;

  if (key) {
    const member = members.find(getKeyComparator(key));

    if (member) {
      permission = await getMemberPermission(member.role);
    }
  }

  return permission;
}

async function getUserWithKey(key) {
  const users =  await User.find({'keys.value': {'$in': [key]}});

  return users.length > 0;
}

async function getMemberPermission(role) {
  const title = constants.resources.chat;
  const resource = await Resource.findOne({title}).lean();
  const options = {role, resource: resource._id};

  return await Permission.findOne(options).select('-_id -__v -resource').lean();
}