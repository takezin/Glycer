const members = async (message, id) => {
  let channel = undefined;
  for (i of message.guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = message.guild.members.cache;
  let numMembers = 0;
  for (let i of members) {
    numMembers++;
  }
  channel.setName(`Member count: ${numMembers}`);
};

module.exports = members;
