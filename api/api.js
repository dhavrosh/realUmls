import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import {mapUrl} from 'utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // modified here  or user file.mimetype
  }
});

require('./config/database');

import * as actions from './actions/index';
import configureAuth from './config/authentication';
import initializeSockets from './actions/socket';

const upload = multer({ storage: storage });

const pretty = new PrettyError();
const app = express();
const server = new http.Server(app);
const io = new SocketIo(server);

io.path('/ws');

app.use(session({
  secret: config.auth.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

configureAuth(app, config);

app.post('/user/upload', upload.single('avatar'));

app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);
  const {action, params} = mapUrl(actions, splittedUrlPath);
  const privateAction = splittedUrlPath[0] !== 'auth';

  if (action) {
    // TODO: add socket authentication & uncomment
    // if (privateAction && !req.isAuthenticated()) res.status(401).end('UNAUTHORIZED');

    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
          res.json(result);
        }
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          const response = typeof reason === 'object' ? reason : {message: reason};
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(response);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
  const chat = io.of('/chat');

  initializeSockets(chat);
  io.listen(runnable);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
