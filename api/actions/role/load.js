import Role from '../../models/Role';

export default function load() {
  return new Promise((resolve, reject) => {
    const loadRoles = async () => {
      const Roles = await Role.find({}).select('_id, title');

      resolve(Roles);
    };

    loadRoles().catch(reject);
  });
}