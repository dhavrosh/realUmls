import mongoose from 'mongoose';
import config from '../../src/config';

require('../actions/auth/User');

mongoose.promise = global.Promise;
mongoose.connect(config.mongoUrl);