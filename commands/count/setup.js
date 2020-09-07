const { init } = require('../../util/server');

const setup = async (message) => {
  await init(message);
};

module.exports = setup;
