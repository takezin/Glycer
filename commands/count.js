const args = require('../util/args');
const Glycer = require('../db/glycer');
const {
  init,
  memberUpdate,
  userUpdate,
  botUpdate,
  onlineUpdate,
  updateAll,
} = require('../util/counter');

const setup = async (message) => {
  const id = await init(message);
  setTimeout(async () => {
    await memberUpdate(message, id.members);
    await userUpdate(message, id.users);
    await botUpdate(message, id.bots);
    await onlineUpdate(message, id.online);
  }, 300000);
};

module.exports = {
  name: 'count',
  description: 'Give a role to an user!',
  async execute(message) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const arg = args(message.content);
      if (arg[0] === 'setup') {
        setup(message);
        message.channel.send('Done!');
      } else if (arg[0] === 'update') {
        await updateAll(message);
        setInterval(async () => {
          await updateAll(message);
          console.log('Updating counter');
        }, 300000);
      } else {
        const db = await Glycer.findOne({ serverid: message.guild.id });
        if (arg[0] === 'members') {
          const channelid = db.count.members;
          memberUpdate(message, channelid);
          message.channel.send('Members counter updated!');
        } else if (arg[0] === 'users') {
          const channelid = db.count.users;
          userUpdate(message, channelid);
          message.channel.send('Users counter updated!');
        } else if (arg[0] === 'bots') {
          const channelid = db.count.bots;
          botUpdate(message, channelid);
          message.channel.send('Bots counter updated!');
        }
      }
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
