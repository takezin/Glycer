const Discord = require('discord.js');

module.exports = {
  name: 'test',
  description: 'Give a role to an user!',
  execute(message, client) {
    const split = message.content.split(/ +/);
    const args = split.slice(1);
    const member = message.mentions.members.first();
    console.log(member);
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#57bc59')
      .setTitle('Role added')
      .setAuthor(`@${member.nickname}`, `${member.user.displayAvatarURL()}`)
      .setDescription(`${role}`)
      .setTimestamp()
      .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    return message.channel.send(exampleEmbed);
  },
};
