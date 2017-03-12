import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import {mapUrl} from 'utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';

require('./config/database');

import * as actions from './actions/index';
import configureAuth from './config/authentication';

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

app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);
  const {action, params} = mapUrl(actions, splittedUrlPath);
  const privateAction = splittedUrlPath[0] !== 'auth';

  if (action) {
    if (privateAction && !req.isAuthenticated()) res.status(401).end('UNAUTHORIZED');

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

function Room(id, bufferSize) {
  this.id = id;
  this.sockets = [];
  this.bufferSize = bufferSize;
  this.messages = new Array(bufferSize);
  this.messageIndex = 0;
  this.addSocket = socket => this.sockets.push(socket);
  this.getId = () => this.id;
  this.getMessages = () => this.messages;
  this.addMessage = message => {
    message.id = this.messageIndex;
    this.messages[this.messageIndex % this.bufferSize] = message;
    this.messageIndex++;
  };
}

function Rooms() {
  this.rooms = [];
  this.getBySocket = socket => this.rooms.find(room => room.sockets.indexOf(socket) > -1);
  this.getById = id => this.rooms.find(room => room.id === id);
  this.create = (id, socket) => {
    const room = new Room(id, 100);
    room.addSocket(socket);
    this.rooms.push(room);
    return room;
  }
}

const rooms = new Rooms();

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  const chat = io.of('/chat');

  chat.on('connection', (socket) => {

    socket.on('JOIN_ROOM', id => {
      let room = rooms.getById(id);

      if (!room) {
        room = rooms.create(id, socket.id);
      } else room.addSocket(socket.id);

      socket.join(id);
      socket.emit('INIT', room.getMessages());
      // socket.broadcast.to(id).emit('NEW_PARTICIPANT');
    });

    socket.on('MESSAGE', (id, data) => {
      const room = rooms.getById(id);

      room.addMessage(data);
      chat.in(room.getId()).emit('MESSAGE', data);
    });

  });

  io.listen(runnable);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
