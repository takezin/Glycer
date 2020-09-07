module.exports = {
  name: 'whois',
  description: 'Get information about a user.',
  execute(message, client) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const member = message.mentions.members.first();
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
