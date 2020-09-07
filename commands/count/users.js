const users = async (message, id) => {
  let channel = undefined;
  for (i of message.guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = message.guild.members.cache;
  let numUsers = members.filter((member) => !member.user.bot).size;
  channel.setName(`Users count: ${numUsers}`);
};

module.exports = users;
