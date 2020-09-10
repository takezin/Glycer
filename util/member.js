const Discord = require('discord.js');

const nickChange = (oldMember, member) => {
  const embed = new Discord.MessageEmbed();
  embed
    .setColor(`#0072BB`)
    .setTitle('**Nickname changed**')
    .setAuthor(
      `${member.user.username}#${member.user.discriminator}`,
      `${member.user.displayAvatarURL()}`
    )
    .setDescription(
      `**Before:** ${oldMember.nickname} \n**+After:** ${member.nickname}`
    )
    .setFooter(`ID: ${member.id}`)
    .setTimestamp();

  return embed;
};

const nameChange = (oldMember, member) => {
  const embed = new Discord.MessageEmbed();
  embed
    .setColor(`#0072BB`)
    .setTitle('**Nickname changed**')
    .setAuthor(
      `${member.user.username}#${member.user.discriminator}`,
      `${member.user.displayAvatarURL()}`
    )
    .setDescription(
      `**Before:** ${oldMember.user.username} \n**+After:** ${member.user.username}`
    )
    .setFooter(`ID: ${member.id}`)
    .setTimestamp();

  return embed;
};

const avatarChange = (member) => {
  const embed = new Discord.MessageEmbed();
  embed
    .setColor(`#0072BB`)
    .setTitle('**Nickname changed**')
    .setAuthor(
      `${member.user.username}#${member.user.discriminator}`,
      `${member.user.displayAvatarURL()}`
    )
    .setThumbnail(`${member.user.displayAvatarURL()}`)
    .setDescription(`${member}`)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp();

  return embed;
};

const roleChange = (oldMember, member) => {
  const oldRoles = oldMember._roles;
  const newRoles = member._roles;
  const embed = new Discord.MessageEmbed();
  let change = undefined;
  console.log(oldRoles);
  if (oldRoles.length > newRoles.length) {
    for (let role of oldRoles) {
      console.log(role);
      if (!newRoles.some((i) => i.name === role.name)) {
        change = role;
      }
    }
    embed.setColor(`#d7263d`).setTitle('**Role removed**');
  } else {
    for (let role of newRoles) {
      if (!oldRoles.some((i) => i.name === role.name)) {
        change = role;
      }
    }
    embed.setColor(`#57bc59`).setTitle('**Role added**');
  }

  for (role of member.guild.roles.cache) {
    if (role[0] === change) {
      change = role[1];
    }
  }

  embed
    .setAuthor(
      `${member.user.username}#${member.user.discriminator}`,
      `${member.user.displayAvatarURL()}`
    )
    .setDescription(`${change}`)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp();

  return embed;
};

module.exports = {
  nickChange,
  nameChange,
  avatarChange,
  roleChange,
};
