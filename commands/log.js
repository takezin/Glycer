const args = require('../util/args');
const Glycer = require('../db/glycer');
const { init } = require('../util/log');

const setup = async (message) => {
  await init(message);
};

module.exports = {
  name: 'log',
  description: 'Audit logs',
  async execute(message) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const arg = args(message.content);
      if (arg[0] === 'setup') {
        setup(message);
        message.channel.send('Done!');
      }
    }
  },
};
