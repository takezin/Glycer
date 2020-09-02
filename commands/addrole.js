const Discord = require('discord.js');

module.exports = {
  name: 'addrole',
  description: 'Create a role!',
  execute(message, client) {
    const split = message.content.split(/ +/);
    const args = split.slice(1);
    if (!args[0]) {
      throw new Error('No given name!');
    }
    if (args[1].length > 6) {
      throw new Error('No valid hex color!');
    }
    message.guild.roles.create({
      data: {
        name: args[0],
        color: `0x${args[1]}`,
      },
    });
    const embed = new Discord.MessageEmbed();
    embed
      .setColor(`#57bc59`)
      .setTitle('New role created')
      .addFields(
        { name: 'Name', value: `${args[0]}` },
        { name: 'Color', value: `#${args[1]}` }
      )
      .setTimestamp();
    message.channel.send(embed);
  },
};
