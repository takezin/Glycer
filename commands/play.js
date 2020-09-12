const ytdl = require('ytdl-core');
const Discord = require('discord.js');

module.exports = {
  name: 'play',
  description: 'Play a song in your channel!',
  async execute(message) {
    if (
      message.member.roles.cache.some(
        (role) => role.name === 'admin' || 'mod' || 'dj'
      )
    ) {
      try {
        const args = message.content.split(' ');
        const queue = message.client.queue;
        const serverQueue = message.client.queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
          return message.channel.send(
            'You need to be in a voice channel to play music!'
          );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
          return message.channel.send(
            'I need the permissions to join and speak in your voice channel!'
          );
        }

        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
        };

        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
          };

          queue.set(message.guild.id, queueContruct);

          queueContruct.songs.push(song);

          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            this.play(message, queueContruct.songs[0]);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        } else {
          serverQueue.songs.push(song);
          const embed = new Discord.MessageEmbed();
          embed
            .setColor(`#0072BB`)
            .setTitle('Qeued')
            .setThumbnail(`${song.thumbnail}`)
            .setDescription(
              `
          [${song.title}](${song.url})
          `
            )
            .setTimestamp();
          return serverQueue.textChannel.send(embed);
        }
      } catch (error) {
        console.log(error);
        message.channel.send(error.message);
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
