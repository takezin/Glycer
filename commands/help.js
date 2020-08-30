const fs = require('fs');
const { prefix } = require('../config/config');

module.exports = {
  name: 'help',
  description: 'List all available commands.',
  execute(message) {
    let str = '';
    const commandFiles = fs
      .readdirSync('./commands')
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      str += `\`${prefix}${command.name}\`:   ${command.description} \n`;
    }

    message.channel.send(str);
  },
};
