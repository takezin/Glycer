const Glycer = require('../db/glycer');

const init = async (message) => {
  const category = await message.guild.channels.create('📊 Server stats 📊', {
    type: 'category',
    permissionOverwrites: [
      {
        id: message.guild.roles.everyone.id,
        deny: ['CONNECT'],
      },
    ],
  });
  const members = await memberCount(message, category);
  const users = await userCount(message, category);
  const bots = await botCount(message, category);
  const online = await onlineCount(message, category);
  let db = await Glycer.findOne({ serverid: message.guild.id });
  if (db) {
    await db.updateOne({
      count: {
        category: category.id,
        members,
        users,
        bots,
        online,
      },
    });
  } else {
    db = new Glycer({
      serverid: message.guild.id,
      count: {
        category: category.id,
        members,
        users,
        bots,
        online,
      },
    });
  }
  try {
    await db.save();
  } catch (e) {
    console.log(e);
  }
  return { members, users, bots, online };
};

const memberCount = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('Members: ', {
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
    const channel = await message.guild.channels.create('Bots: ', {
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
    const channel = await message.guild.channels.create('Humans: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};

const onlineCount = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('Online: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};
const memberUpdate = (message, id) => {
  let channel = undefined;
  for (i of message.guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = message.guild.members.cache;
  channel.setName(`Members: ${members.size}`);
};

const botUpdate = (message, id) => {
  let channel = undefined;
  for (i of message.guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = message.guild.members.cache;
  let numUsers = members.filter((member) => member.user.bot).size;
  channel.setName(`Bots: ${numUsers}`);
};

const userUpdate = (message, id) => {
  let channel = undefined;
  for (i of message.guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = message.guild.members.cache;
  let numUsers = members.filter((member) => !member.user.bot).size;
  channel.setName(`Humans: ${numUsers}`);
};

const onlineUpdate = (message, id) => {
  let channel = undefined;
  for (i of message.guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = message.guild.members.cache;
  const online = members.filter(
    (member) => member.presence.status === 'online' && !member.user.bot
  );
  channel.setName(`Online: ${online.size}`);
};

const updateAll = async (message) => {
  const db = await Glycer.findOne({ serverid: message.guild.id });
  if (db.count.members) {
    memberUpdate(message, db.count.members);
  }
  if (db.count.users) {
    userUpdate(message, db.count.users);
  }
  if (db.count.bots) {
    botUpdate(message, db.count.bots);
  }
  if (db.count.online) {
    onlineUpdate(message, db.count.online);
  }
};
module.exports = {
  init,
  memberCount,
  userCount,
  botCount,
  onlineCount,
  memberUpdate,
  userUpdate,
  botUpdate,
  onlineUpdate,
  updateAll,
};
