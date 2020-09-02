const Discord = require('discord.js');

const removeAll = (message, client, role) => {
  const embed = new Discord.MessageEmbed();
  if (!role) {
    throw new Error('No role given!');
  }
  console.log(role.members.size);
  if (role.members.size === 0) {
    console.log('añadir');
    message.guild.members.cache.map((element) => {
      element.roles.add(role);
    });
    embed
      .setColor('#57bc59')
      .setTitle('All users added')
      .setDescription(`${role}`)
      .setTimestamp();
  } else {
    console.log('eliminar');
    message.guild.members.cache.map((element) => {
      element.roles.remove(role);
    });
    embed
      .setColor('#d7263d')
      .setTitle('All users removed')
      .setDescription(`${role}`)
      .setTimestamp();
  }
  return message.channel.send(embed);
};

module.exports = removeAll;
