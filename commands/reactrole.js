const Glycer = require('../db/glycer');
const args = require('../util/args');

module.exports = {
  name: 'reactrole',
  description: 'Delete a role!',
  async execute(message) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      let db = await Glycer.findOne({ serverid: message.guild.id });
      if (!db) {
        db = new Glycer({
          serverid: message.guild.id,
        });
        await db.save();
      }
      const prev = db.roleOnReact;
      const reactions = {};

      let lastMessage;
      let i = 0;
      for (let mes of message.channel.messages.cache) {
        i++;
      }
      let c = 0;
      for (let mes of message.channel.messages.cache) {
        if (c === i - 2) {
          lastMessage = mes[1];
        }
        c++;
      }

      for (let arg of args(message.content)) {
        const i = arg.split(':');
        for (let role of message.guild.roles.cache) {
          if (role[1].name === i[1]) {
            reactions[i[0]] = role[1];
          }
        }
        lastMessage.react(i[0]);
      }

      let roleOnReact = {};
      if (prev) {
        roleOnReact = { ...prev };
      }
      roleOnReact[lastMessage.id] = reactions;
      await db.updateOne({
        roleOnReact,
      });
      await db.save();
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
