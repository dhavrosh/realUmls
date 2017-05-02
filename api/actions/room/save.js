import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import extend from 'deep-extend';
import Room from '../../models/Room';

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
            const membersToInform = getNewMembers(oldMembers, receivedMembers);

            if (membersToInform.length > 0) {
              informMembers(membersToInform);
            }
          }

          extend(room, req.body);
        } else {
          room = new Room(data);
        }

        const savedRoom = await room.save();

        resolve(savedRoom);
    };

    saveRoom().catch(reject);
  });
}

function getNewMembers(oldMembers, receivedMembers) {
  return receivedMembers.filter(receivedMember =>
    typeof oldMembers.find(oldMember => oldMember.email === receivedMember.email) === 'undefined'
  );
}

function informMembers(members) {
  const to = members.map(member => member.email).join();

  const options = {
    to,
    from: 'dhavrosh@gmail.com',
    subject: 'Hello ✔',
    text: 'Hello world ?',
    html: '<b>Hello world ?</b>'
  };

  sendMail(options);
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