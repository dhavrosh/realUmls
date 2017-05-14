import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import extend from 'deep-extend';
import Room from '../../models/Room';
import User from '../../models/User';

export default function save(req, [id]) {
  return new Promise((resolve, reject) => {
    const saveRoom = async () => {
        const userId = req.user._id;
        const roomId = id || mongoose.Types.ObjectId();
        const data = { ...req.body, creator: userId };

        let room = await Room.findById(roomId);

        if (room) {
          const oldMembers = room.members;
          const receivedMembers = req.body.members;

          if (Array.isArray(oldMembers) && Array.isArray(receivedMembers) && receivedMembers.length > 0) {
            const membersToInform = getNewMembers(oldMembers, receivedMembers, room._id);

            if (membersToInform.length > 0) {
              informMembers(room._id, membersToInform);
            }
          }

          extend(room, req.body);
        } else {
          if (data.members) {
            data.members.forEach(member => addKeyToMember(member, roomId));
            informMembers(roomId, data.members);
          }
          room = new Room(data);
        }

        const savedRoom = await room.save();

        resolve(savedRoom);
    };

    saveRoom().catch(reject);
  });
}

function getNewMembers(oldMembers, receivedMembers, roomId) {
  return receivedMembers.filter(receivedMember => {
    const isNew = typeof oldMembers.find(oldMember => oldMember.email === receivedMember.email) === 'undefined';

    if (isNew) {
      addKeyToMember(receivedMember, roomId);
    }

    return isNew;
  });
}

function informMembers(roomId, members) {
  members.forEach(member => {
    const options = {
      to: member.email,
      from: 'dhavrosh@gmail.com',
      subject: 'Room ✔',
      text: 'Room ✔',
      html: `<a href="http://localhost:3000/room/${roomId}?k=${member.key}">Room ✔</a>`
    };

    sendMail(options);
  });
}

function sendMail(options) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dhavrosh@gmail.com',
      pass: 'DinamoKiev2379Dan'
    }
  });

  transporter.sendMail(options, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

function addKeyToMember(member, roomId) {
  const key = mongoose.Types.ObjectId().toString();

  member.key = key;
  User.findOne({email: member.email}).then(member => {
    if (member) {
      console.log('saving new key for member...');
      member.keys.push({value: key, room: roomId});
      member.save();
    }
  }).catch(err => console.error(err));
}