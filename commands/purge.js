module.exports = {
  name: 'purge',
  description: 'Delete the last messages in the chat.',
  async execute(message) {
    if (
      message.member.roles.cache.some((role) => role.name === 'admin' || 'mod')
    ) {
      const args = message.content.split(' ');
      let deleteCount = 0;
      try {
        deleteCount = parseInt(args[1], 10);
        deleteCount++;
      } catch (err) {
        return message.reply(
          'Please provide the number of messages to delete. (max 100)'
        );
      }

      if (!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply(
          'Please provide a number between 2 and 100 for the number of messages to delete'
        );

      const fetched = await message.channel.messages.fetch({
        limit: deleteCount,
      });
      message.channel
        .bulkDelete(fetched)
        .catch((error) =>
          message.reply(`Couldn't delete messages because of: ${error}`)
        );
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
