const bots = async (message, id) => {
  let channel = undefined;
  for (i of message.guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = message.guild.members.cache;
  let numUsers = members.filter((member) => member.user.bot).size;
  channel.setName(`Bot count: ${numUsers}`);
};

module.exports = bots;
