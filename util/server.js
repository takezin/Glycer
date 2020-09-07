const Glycer = require('../db/glycer');

const init = async (message) => {
  const category = await message.guild.channels.create('📊 Server stats 📊', {
    type: 'category',
  });
  const db = new Glycer({
    serverid: message.guild.id,
    count: {
      category: category.id,
      members: await memberCount(message, category),
      users: await userCount(message, category),
      bots: await botCount(message, category),
    },
  });
  try {
    await db.save();
  } catch (e) {
    console.log(e);
  }
};

const serverid = (message) => {
  return message.guild.id;
};

const memberCount = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('Member count: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};
const botCount = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('Bot count: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};
const userCount = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('User count: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  init,
  serverid,
  memberCount,
  userCount,
};
