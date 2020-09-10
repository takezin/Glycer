const Glycer = require('../db/glycer');

const roleOnReact = async (serverId, messageId, emoji, userId, client) => {
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
    console.log();
    if (user.roles.cache.some((i) => i.id === roleId)) {
      user.roles.remove(role);
    } else {
      user.roles.add(role);
    }
    // if (member.roles.cache.some((i) => i.name === role.name)) {
    //   member.roles.remove(role);
    //   embed
    //     .setColor('#d7263d')
    //     .setTitle('Role removed')
    //     .setAuthor(`@${name}`, `${member.user.displayAvatarURL()}`)
    //     .setDescription(`${role}`)
    //     .setTimestamp();
    // } else {
    //   member.roles.add(role);
    //   embed
    //     .setColor('#57bc59')
    //     .setTitle('Role added')
    //     .setAuthor(`@${name}`, `${member.user.displayAvatarURL()}`)
    //     .setDescription(`${role}`)
    //     .setTimestamp();
    // }
  }
};

module.exports = {
  roleOnReact,
};
