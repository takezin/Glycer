const args = (content) => {
  const split = content.split(/ +/);
  const args = split.slice(1);
  return args;
};

module.exports = args;
