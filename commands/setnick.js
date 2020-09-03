const Discord = require('discord.js');

module.exports = {
  name: 'setnick',
  description: 'Change user nickname!',
  execute(message) {
    const member = message.mentions.members.first();
    const split = message.content.split(/ +/);
    const args = split.slice(1);
    const nickname = args[1];

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
