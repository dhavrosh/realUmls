import mongoose from 'mongoose';
import { roles } from '../constants'

const RoleSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

const Role = mongoose.model('Role', RoleSchema);

function initializeRoles() {
  [
    roles.creator,
    roles.participant,
    roles.viewer
  ].forEach(role => {
    const roleObj = { title: role };
    const options = { upsert: true };

    Role.findOneAndUpdate(roleObj, roleObj, options, err => {
      err && console.log(`Roles initialization failed: ${err}`);
    });
  });
}

initializeRoles();

export default Role;