const Discord = require('discord.js');

module.exports = {
  name: 'rolename',
  description: 'Change role name!',
  execute(message, client) {
    const split = message.content.split(/ +/);
    const args = split.slice(1);
    const name = args[1];
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
        { name: 'Before', value: `@${role}` }
      )
      .setTimestamp();
    message.channel.send(embed);
  },
};
