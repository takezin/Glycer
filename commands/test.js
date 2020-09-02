const Discord = require('discord.js');

module.exports = {
  name: 'test',
  description: 'Give a role to an user!',
  execute(message, client) {
    const split = message.content.split(/ +/);
    const args = split.slice(1);

    message.guild.roles.create({
      data: {
        name: args[0],
        color: `0x${args[1]}`,
      },
    });
    const role = message.guild.roles.cache.find(
      (role) => role.name === 'wqreqr'
    );
    console.log(role);
  },
};
