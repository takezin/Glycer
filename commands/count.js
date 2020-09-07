const args = require('../util/args');
const Glycer = require('../db/glycer');

module.exports = {
  name: 'count',
  description: 'Give a role to an user!',
  async execute(message) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const arg = args(message.content);
      if (arg[0] === 'setup') {
        const setup = require('./count/setup');
        setup(message);
      } else {
        const db = await Glycer.findOne({ serverid: message.guild.id });
        if (arg[0] === 'members') {
          const members = require('./count/members');
          const channelid = db.count.members;
          members(message, channelid);
        } else if (arg[0] === 'users') {
          const users = require('./count/users');
          const channelid = db.count.users;
          users(message, channelid);
        } else if (arg[0] === 'bots') {
          const users = require('./count/bots');
          const channelid = db.count.bots;
          users(message, channelid);
        }
      }
    }
  },
};
