const Discord = require('discord.js');
const args = require('../util/args');

module.exports = {
  name: 'rolename',
  description: 'Change role name!',
  execute(message) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const arg = args(message.content);
      const name = arg[1];
      if (!name) {
        throw new Error('No new name given!');
      }
      const role = message.mentions.roles.first();
      if (!role) {
        throw new Error('No role given!');
      }
      role.setName(name);

      const embed = new Discord.MessageEmbed();
      embed
        .setColor(`#0072BB`)
        .setTitle('Role name changed')
        .addFields(
          { name: 'After', value: `@${role.name}` },
          { name: 'Before', value: `${role}` }
        )
        .setTimestamp();
      message.channel.send(embed);
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
