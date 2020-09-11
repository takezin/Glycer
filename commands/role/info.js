const Discord = require('discord.js');

const removeInfo = (message, client, role) => {
  if (!role) {
    throw new Error('No role given!');
  }

  const users = role.members.map((u) => u).join('\n');
  const embed = new Discord.MessageEmbed();
  let size = 0;
  for (let i of role.members) {
    size++;
  }
  embed
    .setColor(`#0072BB`)
    .addFields(
      { name: `Role name `, value: `${role}`, inline: true },
      { name: ' ID', value: `${role.id}`, inline: true },
      { name: 'Color', value: `#${role.color.toString(16)}`, inline: true },
      { name: 'Users in role', value: `${size}` }
    );
  if (users.length) {
    embed.addFields({ name: 'Users list', value: `${users}`, inline: true });
  }

  message.channel.send(embed);
};

module.exports = removeInfo;
