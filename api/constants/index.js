const constants = Object();

constants.roles = require('./roles');
constants.permissions = require('./permissions');
constants.resources = require('./resources');

export default Object.freeze(constants);