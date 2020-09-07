const Discord = require('discord.js');
const args = require('../util/args');
module.exports = {
  name: 'role',
  description: 'Give a role to an user!',
  execute(message, client) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const arg = args(message.content);
      const role = message.mentions.roles.first();
      const member = message.mentions.members.first();
      if (arg[0] === 'all') {
        const roleAll = require('./role/all.js');
        roleAll(message, client, role);
      } else if (arg[0] === 'info') {
        const roleInfo = require('./role/info.js');
        roleInfo(message, client, role);
      } else {
        let name = member.nickname;
        if (name === null) {
          name = member.user.username;
        }
        const embed = new Discord.MessageEmbed();
        if (member.roles.cache.some((i) => i.name === role.name)) {
          member.roles.remove(role);
          embed
            .setColor('#d7263d')
            .setTitle('Role removed')
            .setAuthor(`@${name}`, `${member.user.displayAvatarURL()}`)
            .setDescription(`${role}`)
            .setTimestamp();
        } else {
          member.roles.add(role);
          embed
            .setColor('#57bc59')
            .setTitle('Role added')
            .setAuthor(`@${name}`, `${member.user.displayAvatarURL()}`)
            .setDescription(`${role}`)
            .setTimestamp();
        }
        return message.channel.send(embed);
      }
    }
  },
};
