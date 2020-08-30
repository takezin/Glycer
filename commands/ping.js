module.exports = {
  name: 'ping',
  description: 'Test if the bot is alive!',
  execute(message) {
    return message.channel.send('Pang!');
  },
};
