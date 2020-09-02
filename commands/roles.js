const Discord = require('discord.js');

module.exports = {
  name: 'roles',
  description: 'List of existing roles!',
  execute(message, client) {
    const split = message.content.split(/ +/);
    const args = split.slice(1);

    const roles = message.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => r)
      .join('\n');
    if (roles.length > 1024) roles = 'To many roles to display';
    if (!roles) roles = 'No roles';
    const embed = new Discord.MessageEmbed();
    embed.setColor(`#0072BB`).addField('Role List', roles);
    message.channel.send(embed);
  },
};
