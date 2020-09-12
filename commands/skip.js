module.exports = {
  name: 'skip',
  description: 'Skip a song!',
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
      if (!serverQueue)
        return message.channel.send('There is no song that I could skip!');
      serverQueue.connection.dispatcher.end();
    } else {
      message.reply("You don't have permission to do that");
    }
  },
};
