const args = require('../util/args');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'whois',
  description: 'Get information about a user.',
  execute(message, client) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const arg = args(message.content);
      let member = message.mentions.members.first();
      if (!member) {
        for (let i of message.guild.members.cache) {
          if (i[0] === arg[0]) {
            member = i[1];
          }
        }
      }
      if (!member) {
        return message.reply('Please provide a user');
      }
      const embed = new Discord.MessageEmbed()
        .setColor('#0072BB')
        .setTitle('**User info**')
        .setAuthor(
          `${member.user.username}#${member.user.discriminator}`,
          `${member.user.displayAvatarURL()}`
        )
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .addFields(
          { name: 'User', value: `${member}` },
          { name: 'ID', value: `${member.id}` },
          {
            name: 'Created',
            value: `${moment(member.user.createdAt).fromNow()}`,
          },
          {
            name: 'Joined',
            value: `${moment(member.joinedTimestamp).fromNow()}`,
            inline: true,
          }
        );
      // .addField('Inline field title', 'Some value here', true)
      // .setImage('https://i.imgur.com/wSTFkRM.png')
      // .setTimestamp()
      // .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
      message.channel.send(embed);
    }
  },
};
