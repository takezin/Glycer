const Discord = require('discord.js');
const args = require('../util/args');
module.exports = {
  name: 'setnick',
  description: 'Change user nickname!',
  execute(message) {
    const member = message.mentions.members.first();
    const split = message.content.split(/ +/);
    const arg = args(message.content);
    const nickname = arg[1];

    member.setNickname(nickname);

    const embed = new Discord.MessageEmbed();
    embed
      .setColor(`#0072BB`)
      .setTitle('User nickname changed')
      .addFields(
        { name: 'After', value: `@${member.nickname}` },
        { name: 'Before', value: `@${nickname}` }
      )
      .setTimestamp();
    message.channel.send(embed);
  },
};
