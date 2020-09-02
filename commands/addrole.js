const Discord = require('discord.js');

module.exports = {
  name: 'addrole',
  description: 'Create a role!',
  execute(message, client) {
    const split = message.content.split(/ +/);
    const args = split.slice(1);
    const name = args[0];
    let color = args[1];
    if (!name) {
      throw new Error('No given name!');
    }

    if (!color) {
      color = 0;
    } else if (color.length > 6) {
      throw new Error('No valid hex color!');
    }

    message.guild.roles.create({
      data: {
        name,
        color: `0x${color}`,
      },
    });
    const embed = new Discord.MessageEmbed();
    embed
      .setColor(`#57bc59`)
      .setTitle('New role created')
      .addFields(
        { name: 'Name', value: `${name}` },
        { name: 'Color', value: `#${color}` }
      )
      .setTimestamp();
    message.channel.send(embed);
  },
};
