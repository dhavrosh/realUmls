import mongoose from 'mongoose';
import config from '../../src/config';

require('../models/User');

mongoose.promise = global.Promise;
mongoose.connect(config.mongoUrl);