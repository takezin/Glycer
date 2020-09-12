const ytdl = require('ytdl-core');
const Discord = require('discord.js');

module.exports = {
  name: 'next',
  description: 'Next song in the queue!',
  async execute(message) {
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
      serverQueue.songs.shift();
      try {
        this.play(message, serverQueue.songs[0]);
      } catch (err) {
        console.log(err);
        return message.channel.send(err);
      }
    } else {
      message.reply("You don't have permission to do that");
    }
  },
  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on('finish', () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on('error', (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 4);
    const embed = new Discord.MessageEmbed();
    embed
      .setColor(`#0072BB`)
      .setTitle('Now Playing')
      .setThumbnail(`${song.thumbnail}`)
      .setDescription(
        `
          [${song.title}](${song.url})
          `
      )
      .addField('Requested by: ', `${message.member}`)
      .setTimestamp();
    serverQueue.textChannel.send(embed);
  },
};
