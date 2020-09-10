const Glycer = require('../db/glycer');

module.exports = {
  name: 'invite',
  description: 'Send invite!',
  async execute(message) {
    const db = await Glycer.findOne({ serverid: message.guild.id });
    let invite = undefined;

    if (!db.invite) {
      invite = await message.channel.createInvite({
        maxAge: 0,
        maxUses: 0,
      });
      await db.updateOne({ invite });
      await db.save();
    } else {
      invite = `https://discord.gg/${db.invite}`;
    }
    message.channel.send(`${invite}`);
  },
};
