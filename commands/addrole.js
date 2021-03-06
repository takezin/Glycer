const Discord = require('discord.js');
const args = require('../util/args');

module.exports = {
  name: 'addrole',
  description: 'Create a role!',
  execute(message, client) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const arg = args(message.content);
      const name = arg[0];
      let color = arg[1];
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
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
