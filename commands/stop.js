module.exports = {
  name: 'stop',
  description: 'Stop all songs in the queue!',
  execute(message) {
    if (
      message.member.roles.cache.some(
        (role) => role.name === 'admin' || 'mod' || 'dj'
      )
    ) {
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!message.member.voice.channel)
        return message.channel.send(
          'You have to be in a voice channel to stop the music!'
        );
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
