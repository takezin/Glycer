const Discord = require('discord.js');

const removeInfo = (message, client, role) => {
  if (!role) {
    throw new Error('No role given!');
  }

  const embed = new Discord.MessageEmbed();

  if (role.members.size !== 0) {
    const users = role.members.map((u) => u).join('\n');
    embed
      .setColor(`#0072BB`)
      .setAuthor(`@${role.name}`)
      .addField('**Users List**', users);
  } else {
    embed
      .setColor(`#d7263d`)
      .setAuthor(`@${role.name}`)
      .addField('**Users List**', 'No users');
  }
  message.channel.send(embed);
};

module.exports = removeInfo;
