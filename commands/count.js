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

const setup = async (guild) => {
  const id = await init(guild);
  setTimeout(async () => {
    await memberUpdate(guild, id.members);
    await userUpdate(guild, id.users);
    await botUpdate(guild, id.bots);
    await onlineUpdate(guild, id.online);
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
        setup(message.guild);
        message.channel.send('Done!');
      } else if (arg[0] === 'update') {
        console.log(message.guild);
        await updateAll(message.guild);
        setInterval(async () => {
          await updateAll(message.guild);
        }, 300000);
      } else {
        const db = await Glycer.findOne({ serverid: message.guild.id });
        if (arg[0] === 'members') {
          const channelid = db.count.members;
          memberUpdate(message.guild, channelid);
          message.channel.send('Members counter updated!');
        } else if (arg[0] === 'users') {
          const channelid = db.count.users;
          userUpdate(message.guild, channelid);
          message.channel.send('Users counter updated!');
        } else if (arg[0] === 'bots') {
          const channelid = db.count.bots;
          botUpdate(message.guild, channelid);
          message.channel.send('Bots counter updated!');
        }
      }
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
