const translator = require('../util/transaltor');
const args = require('../util/args');

module.exports = {
  name: 'translate',
  description: 'Translate text to a given language',
  async execute(message) {
    const arg = args(message.content);
    const to = arg.shift();
    const text = arg.reduce((prev, act) => (prev = prev + ' ' + act));
    const translate = await translator(text, to);
    return message.channel.send(translate);
  },
};
