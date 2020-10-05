module.exports = {
  name: 'ping',
  description: 'Test if the bot is alive!',
  execute(message, client) {
    return message.channel.send(
      `🏓 **Pong!**\n Latency is ${
        Date.now() - message.createdTimestamp
      }ms. \nAPI Latency is ${Math.round(client.ws.ping)}ms`
    );
  },
};
