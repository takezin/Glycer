const Glycer = require('../db/glycer');

const init = async (guild) => {
  const category = await guild.channels.create('📊 Server stats 📊', {
    type: 'category',
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: ['CONNECT'],
      },
    ],
  });
  const members = await memberCount(guild, category);
  const users = await userCount(guild, category);
  const bots = await botCount(guild, category);
  const online = await onlineCount(guild, category);
  let db = await Glycer.findOne({ serverid: guild.id });
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
      serverid: guild.id,
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

const memberCount = async (guild, category) => {
  try {
    const channel = await guild.channels.create('Members: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};
const botCount = async (guild, category) => {
  try {
    const channel = await guild.channels.create('Bots: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};
const userCount = async (guild, category) => {
  try {
    const channel = await guild.channels.create('Humans: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};

const onlineCount = async (guild, category) => {
  try {
    const channel = await guild.channels.create('Online: ', {
      type: 'voice',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};
const memberUpdate = (guild, id) => {
  let channel = undefined;
  for (i of guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = guild.members.cache;
  channel.setName(`Members: ${members.size}`);
};

const botUpdate = (guild, id) => {
  let channel = undefined;
  for (i of guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = guild.members.cache;
  let numUsers = members.filter((member) => member.user.bot).size;
  channel.setName(`Bots: ${numUsers}`);
};

const userUpdate = (guild, id) => {
  let channel = undefined;
  for (i of guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = guild.members.cache;
  let numUsers = members.filter((member) => !member.user.bot).size;
  channel.setName(`Humans: ${numUsers}`);
};

const onlineUpdate = (guild, id) => {
  let channel = undefined;
  for (i of guild.channels.cache) {
    if (i[0] === id) {
      channel = i[1];
    }
  }
  const members = guild.members.cache;
  const online = members.filter(
    (member) => member.presence.status === 'online' && !member.user.bot
  );
  channel.setName(`Online: ${online.size}`);
};

const updateAll = async (guild) => {
  const db = await Glycer.findOne({ serverid: guild.id });
  if (db.count.members) {
    memberUpdate(guild, db.count.members);
  }
  if (db.count.users) {
    userUpdate(guild, db.count.users);
  }
  if (db.count.bots) {
    botUpdate(guild, db.count.bots);
  }
  if (db.count.online) {
    onlineUpdate(guild, db.count.online);
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
