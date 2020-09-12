const Glycer = require('../db/glycer');

const roleOnReact = async (
  serverId,
  messageId,
  emoji,
  userId,
  client,
  remove
) => {
  const db = await Glycer.findOne({
    serverid: serverId,
  });
  if (!db) {
    return;
  }
  if (db.roleOnReact[messageId]) {
    const roleId = db.roleOnReact[messageId][emoji];

    let rolesCache = undefined;
    let usersCache = undefined;
    for (let i of client.guilds.cache) {
      rolesCache = i[1].roles.cache;
      usersCache = i[1].members.cache;
    }
    let role = undefined;
    for (let i of rolesCache) {
      if (i[0] === roleId) {
        role = i[1];
      }
    }
    let user = undefined;
    for (let i of usersCache) {
      if (i[0] === userId) {
        user = i[1];
      }
    }
    if (remove && user.roles.cache.some((i) => i.id === roleId)) {
      user.roles.remove(role);
    } else {
      user.roles.add(role);
    }
  }
};

module.exports = {
  roleOnReact,
};
