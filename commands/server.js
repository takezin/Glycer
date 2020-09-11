const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'server',
  description: 'Server info',
  async execute(message) {
    const members = message.guild.members.cache;
    const bots = members.filter((member) => member.user.bot).size;
    const users = members.filter((member) => !member.user.bot).size;
    const online = members.filter(
      (member) => member.presence.status === 'online' && !member.user.bot
    ).size;
    const roles = message.guild.roles.cache.size;
    const ownerID = message.guild.ownerID;
    let owner = undefined;
    for (let user of members) {
      if (user[0] === ownerID) {
        owner = user[1];
      }
    }

    const createdAt = message.guild.createdAt;
    const channels = message.guild.channels.cache;
    const text = channels.filter((channel) => channel.type === 'text').size;
    const voice = channels.filter((channel) => channel.type === 'voice').size;
    const categories = channels.filter((channel) => channel.type === 'category')
      .size;
    const embed = new Discord.MessageEmbed();
    embed
      .setColor('#0072BB')
      .setTitle(`**${message.guild.name}server info**`)
      .setThumbnail(`${message.guild.iconURL()}`)
      .addFields(
        {
          name: 'Owner',
          value: `${owner.user.username}#${owner.user.discriminator} `,
          inline: true,
        },
        { name: 'ServerID', value: `${message.guild.id}`, inline: true },
        {
          name: 'Created',
          value: `${moment(createdAt).format('DD/MM/YYYY')}`,
          inline: true,
        },
        {
          name: 'Total Roles',
          value: `${roles}`,
          inline: true,
        },
        {
          name: 'Members',
          value: `${members.size} members,\n${online} online,\n${users} humans,\n${bots} bots`,
          inline: true,
        },
        {
          name: 'Total Channels',
          value: `${channels.size} total channels:\n${categories} categories\n ${text} text, ${voice} voice`,
          inline: true,
        }
      );
    message.channel.send(embed);
  },
};
