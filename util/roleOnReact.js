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
    const serverGuild = await client.guilds.fetch(serverId);
    const role = await serverGuild.roles.fetch(roleId);
    console.log(role);
    const user = await serverGuild.members.fetch(userId);

    if (user.id != client.user.id) {
      if (remove && user.roles.cache.some((i) => i.id === roleId)) {
        user.roles.remove(role);
      } else {
        user.roles.add(role);
      }
    }
  }
};

module.exports = {
  roleOnReact,
};
