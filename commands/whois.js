const args = require('../util/args');
module.exports = {
  name: 'whois',
  description: 'Get information about a user.',
  execute(message, client) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const arg = args(message.content);
      let member = message.mentions.members.first();
      if (!member) {
        for (let i of message.guild.members.cache) {
          if (i[0] === arg[0]) {
            member = i[1];
          }
        }
      }
      message.channel.send(
        `Name: ${member.user.username}, ID: ${
          member.user.id
        }, Avatar: ${member.user.displayAvatarURL({
          dynamic: true,
        })}`
      );
    }
  },
};
