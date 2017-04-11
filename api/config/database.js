import mongoose from 'mongoose';
import config from '../../src/config';

require('../models/User');
require('../models/Room');
require('../models/Role');
require('../models/Resource');
require('../models/Permission');

mongoose.promise = global.Promise;
mongoose.connect(config.mongoUrl);