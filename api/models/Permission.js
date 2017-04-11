import mongoose from 'mongoose';
import Role from '../models/Role';
import Resource from '../models/Resource';
import { roles, resources, permissions } from '../constants'

const PermissionSchema = new mongoose.Schema({
  role: { type: String, required: true },
  resource: { type: String, required: true },
  create: { type: Boolean, required: true, default: false },
  read: { type: Boolean, required: true, default: true },
  write: { type: Boolean, required: true, default: false },
  delete: { type: Boolean, required: true, default: false }
});

const Permission = mongoose.model('Permission', PermissionSchema);

async function initializePermissions() {
  const userRoles = {
    creator: await Role.findOne({ title: roles.creator }).select('_id'),
    participant: await Role.findOne({ title: roles.participant }).select('_id'),
    viewer: await Role.findOne({  title: roles.viewer }).select('_id'),
  };
  const userResources = {
    chat: await Resource.findOne({ title: resources.chat }).select('_id'),
  };

  const userPermissions = {
    [userResources.chat._id]: [
      {
        role: userRoles.creator._id,
        create: true,
        read: true,
        write: true,
        delete: true
      },
      {
        role: userRoles.participant._id,
        create: false,
        read: true,
        write: true,
        delete: false
      },
      {
        role: userRoles.viewer._id,
        create: false,
        read: true,
        write: false,
        delete: false
      }
    ]
  };

  for (const prop in userPermissions) {
    if (userPermissions.hasOwnProperty(prop)) {
      userPermissions[prop].forEach(permission => {
        const permissionObj = { ...permission, resource: prop};
        const options = { upsert: true };

         Permission.findOneAndUpdate(permissionObj, permissionObj, options, err => {
          err && console.log(`Permissions initialization failed: ${err}`);
         });
      });
    }
  }
}

initializePermissions();

export default Permission;