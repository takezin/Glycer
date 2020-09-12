const Discord = require('discord.js');

module.exports = {
  name: 'delrole',
  description: 'Delete a role!',
  execute(message, client) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const role = message.mentions.roles.first();
      if (!role) {
        throw new Error('No role given!');
      }
      role.delete();

      const embed = new Discord.MessageEmbed();
      embed
        .setColor(`#d7263d`)
        .setTitle('Role removed')
        .setDescription(`@${role.name}`)
        .setTimestamp();
      message.channel.send(embed);
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
