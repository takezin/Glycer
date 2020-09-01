const Discord = require('discord.js');

module.exports = {
  name: 'role',
  description: 'Give a role to an user!',
  execute(message, client) {
    const split = message.content.split(/ +/);
    const args = split.slice(1);
    const member = message.mentions.members.first();
    const role = message.guild.roles.cache.find(
      (role) => role.name === args[0]
    );
    const embed = new Discord.MessageEmbed();
    if (member.roles.cache.some((role) => role.name === args[0])) {
      member.roles.remove(role);
      embed
        .setColor('#d7263d')
        .setTitle('Role removed')
        .setAuthor(`@${member.nickname}`, `${member.user.displayAvatarURL()}`)
        .setDescription(`${role}`)
        .setTimestamp();
    } else {
      member.roles.add(role);
      embed
        .setColor('#57bc59')
        .setTitle('Role added')
        .setAuthor(`@${member.nickname}`, `${member.user.displayAvatarURL()}`)
        .setDescription(`${role}`)
        .setTimestamp();
    }
    return message.channel.send(embed);
  },
};
