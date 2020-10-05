const Discord = require('discord.js');
const Glycer = require('../db/glycer');
const moment = require('moment');
const { updateAll } = require('./counter');

const init = async (message) => {
  let admin = undefined;
  let mod = undefined;
  for (let i of message.guild.roles.cache) {
    if (i[1].name === 'admin') {
      admin = i[1];
    } else if (i[1].name === 'mod') {
      mod = i[1];
    }
  }

  const category = await message.guild.channels.create('Log', {
    type: 'category',
    permissionOverwrites: [
      {
        id: message.guild.roles.everyone.id,
        deny: ['VIEW_CHANNEL'],
      },
      {
        id: admin.id,
        allow: ['VIEW_CHANNEL'],
      },
      {
        id: mod.id,
        allow: ['VIEW_CHANNEL'],
        deny: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      },
    ],
  });
  const server = await serverLog(message, category);
  const voice = await voiceLog(message, category);
  const def = await defLog(message, category);
  const members = await membersLog(message, category);
  const messages = await messageLog(message, category);
  let db = await Glycer.findOne({ serverid: message.guild.id });
  if (db) {
    await db.updateOne({
      log: {
        category: category.id,
        server,
        voice,
        def, //default
        members,
        messages,
      },
    });
  } else {
    db = new Glycer({
      serverid: message.guild.id,
      log: {
        category: category.id,
        server,
        voice,
        def,
        members,
        messages,
      },
    });
  }
  try {
    await db.save();
  } catch (e) {
    console.log(e);
  }
  return { server, voice, def, members, messages };
};

const serverLog = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('server-log', {
      type: 'text',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};

const voiceLog = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('voice-log', {
      type: 'text',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};

const defLog = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('default-log', {
      type: 'text',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};

const membersLog = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('members-log', {
      type: 'text',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};

const messageLog = async (message, category) => {
  try {
    const channel = await message.guild.channels.create('message-log', {
      type: 'text',
      parent: category,
    });
    return channel.id;
  } catch (e) {
    console.log(e);
  }
};

const messageDelete = async (message) => {
  const db = await Glycer.findOne({ serverid: message.guild.id });
  if (db.log.messages) {
    let channel = undefined;
    for (let i of message.guild.channels.cache) {
      if (i[0] === db.log.messages) {
        channel = i[1];
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`**Message deleted in #${message.channel.name}**`)
      .setColor('#d7263d')
      .setAuthor(
        `${message.author.tag}`,
        `${message.author.displayAvatarURL()}`
      )
      .setDescription(`${message.content}`)
      .setFooter(`ID: ${message.author.id}`)
      .setTimestamp();

    channel.send(embed);
    if (db.roleOnReact[message.id]) {
      const prev = db.roleOnReact;
      console.log(prev);
      delete prev[message.id];
      console.log(prev);
      await db.updateOne({
        roleOnReact: prev,
      });
      await db.save();
    }
  }
};

const messageDeleteBulk = async (messages, client) => {
  let serverid = undefined;
  for (let i of client.guilds.cache) {
    serverid = i[1].id;
  }
  const db = await Glycer.findOne({ serverid });
  if (db.log.messages) {
    let channel = undefined;
    for (let i of client.guilds.cache) {
      const channels = i[1].channels.cache;
      for (let c of channels) {
        if (c[0] === db.log.messages) {
          channel = c[1];
        }
      }
    }
    let deletedMessages = [];
    for (let i of messages) {
      deletedMessages = [i[1], ...deletedMessages];
    }
    let embed = new Discord.MessageEmbed();
    for (let message of deletedMessages) {
      embed
        .setTitle(`**Message deleted in #${message.channel.name}**`)
        .setColor('#d7263d')
        .setAuthor(
          `${message.author.tag}`,
          `${message.author.displayAvatarURL()}`
        )
        .setDescription(`${message.content}`)
        .setFooter(`ID: ${message.author.id}`)
        .setTimestamp();
      channel.send(embed);

      if (db.roleOnReact[message.id]) {
        const prev = db.roleOnReact;
        delete prev[message.id];
        await db.updateOne({
          roleOnReact: prev,
        });
        await db.save();
      }
    }
  }
};

const messageUpdate = async (oldMessage, message, client) => {
  const db = await Glycer.findOne({ serverid: message.guild.id });
  if (client.user.id === message.author.id) {
    return;
  }
  if (db.log.def) {
    let channel = undefined;
    for (i of message.guild.channels.cache) {
      if (i[0] === db.log.messages) {
        channel = i[1];
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`**Message edited in #${message.channel.name}**`)
      .setColor('#0072BB')
      .setAuthor(
        `${message.author.tag}`,
        `${message.author.displayAvatarURL()}`
      )
      .setDescription(
        `**Before:** ${oldMessage.content} \n **+After:** ${message.content}`
      )
      .setFooter(`ID: ${message.author.id}`)
      .setTimestamp();

    channel.send(embed);
  }
};

const userNew = async (member) => {
  const db = await Glycer.findOne({ serverid: member.guild.id });
  for (let i of member.guild.members.cache) {
    if (member === i.user) {
    }
  }
  if (db.count) {
    await updateAll(member);
  }
  if (db.log.def) {
    let channel = undefined;
    for (i of member.guild.channels.cache) {
      if (i[0] === db.log.def) {
        channel = i[1];
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`**Member joined**`)
      .setColor('#57bc59')
      .setAuthor(
        `${member.user.username}#${member.user.discriminator}`,
        `${member.user.displayAvatarURL()}`
      )
      .setDescription(
        `${member} created ${moment(member.user.createdAt).fromNow()}`
      )
      .setFooter(`ID: ${member.id}`)
      .setTimestamp();

    channel.send(embed);
  }
};

const userDelete = async (member) => {
  const db = await Glycer.findOne({ serverid: member.guild.id });
  if (db.count) {
    await updateAll(member);
    console.log('updating');
  }
  if (db.log.messages) {
    let channel = undefined;
    for (i of member.guild.channels.cache) {
      if (i[0] === db.log.def) {
        channel = i[1];
      }
    }
    const rolesList = member._roles;
    let roles = [];
    for (let role of member.guild.roles.cache) {
      if (rolesList.indexOf(role[0]) != -1) {
        roles = [...roles, role[1]];
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`**Member left**`)
      .setColor('#d7263d')
      .setAuthor(
        `${member.user.username}#${member.user.discriminator}`,
        `${member.user.displayAvatarURL()}`
      )
      .setDescription(
        `${member} joined ${moment(member.joinedTimestamp).fromNow()}\n
      **Roles:** ${roles}`
      )
      .setFooter(`ID: ${member.id}`)
      .setTimestamp();

    channel.send(embed);
  }
};

const memberChange = async (oldMember, member) => {
  const db = await Glycer.findOne({ serverid: member.guild.id });
  const {
    nickChange,
    nameChange,
    avatarChange,
    roleChange,
  } = require('./member');
  if (db.log.members) {
    let channel = undefined;
    for (i of member.guild.channels.cache) {
      if (i[0] === db.log.members) {
        channel = i[1];
      }
    }
    let embed = undefined;
    if (oldMember.nickname !== member.nickname) {
      embed = nickChange(oldMember, member);
    } else if (oldMember.user.username !== member.user.username) {
      embed = nameChange(oldMember, member);
    } else if (oldMember.user.avatar !== member.user.avatar) {
      embed = avatarChange(member);
    } else if (oldMember._roles.length !== member._roles.length) {
      embed = roleChange(oldMember, member);
    }
    channel.send(embed);
  }
};

const roleNew = async (role) => {
  const db = await Glycer.findOne({ serverid: role.guild.id });
  if (db.log.server) {
    let channel = undefined;
    for (i of role.guild.channels.cache) {
      if (i[0] === db.log.server) {
        channel = i[1];
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`**New role created**`)
      .setColor('#57bc59')
      .setDescription(
        `**Name:** ${role.name}\n**Color:** #${role.color.toString(16)}`
      )
      .setFooter(`ID: ${role.id}`)
      .setTimestamp();

    channel.send({ embed });
  }
};

const roleDelete = async (role) => {
  const db = await Glycer.findOne({ serverid: role.guild.id });
  if (db.log.server) {
    let channel = undefined;
    for (i of role.guild.channels.cache) {
      if (i[0] === db.log.server) {
        channel = i[1];
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`**Role reoved**`)
      .setColor('#d7263d')
      .setDescription(`@${role.name}`)
      .setFooter(`ID: ${role.id}`)
      .setTimestamp();

    channel.send({ embed });
  }
};

const voiceUpdate = async (oldState, state) => {
  const db = await Glycer.findOne({ serverid: state.guild.id });
  if (db.log.server) {
    let channel = undefined;
    for (i of state.guild.channels.cache) {
      if (i[0] === db.log.voice) {
        channel = i[1];
      }
    }

    let user = undefined;
    for (let usr of state.guild.members.cache) {
      if (usr[0] === state.id) {
        user = usr[1];
      }
    }

    let embed = new Discord.MessageEmbed();
    if (state.channelID) {
      let voiceChannel = undefined;
      for (let ch of state.guild.channels.cache) {
        if (ch[0] === state.channelID) {
          voiceChannel = ch[1];
        }
      }
      embed
        .setTitle(`**Member joined voice channel**`)
        .setColor('#57bc59')
        .setDescription(
          `**${user.user.username}#${user.user.discriminator}** joined ${voiceChannel}`
        );
    } else {
      let voiceChannel = undefined;
      for (let ch of state.guild.channels.cache) {
        if (ch[0] === oldState.channelID) {
          voiceChannel = ch[1];
        }
      }
      embed
        .setTitle(`**Member left voice channel**`)
        .setColor('#d7263d')
        .setDescription(
          `**${user.user.username}#${user.user.discriminator}** left ${voiceChannel}`
        );
    }
    embed
      .setAuthor(
        `${user.user.username}#${user.user.discriminator}`,
        `${user.user.displayAvatarURL()}`
      )
      .setFooter(`ID: ${state.id}`)
      .setTimestamp();
    channel.send(embed);
  }
};

const channelNew = async (channel) => {
  const db = await Glycer.findOne({ serverid: channel.guild.id });
  if (db.log.server) {
    let ch = undefined;
    for (i of channel.guild.channels.cache) {
      if (i[0] === db.log.server) {
        ch = i[1];
      }
    }
    const type = channel.type.charAt(0).toUpperCase() + channel.type.slice(1);
    let category = 'None';
    for (let i of channel.guild.channels.cache) {
      if (i[0] === channel.parentID) {
        category = i[1].name;
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`**${type} channel created**`)
      .setColor('#57bc59')
      .setDescription(`**Name:** ${channel.name}\n**Category:** ${category}`)
      .setFooter(`ID: ${channel.id}`)
      .setTimestamp();

    ch.send({ embed });
  }
};

const channelDelete = async (channel) => {
  const db = await Glycer.findOne({ serverid: channel.guild.id });
  if (db.log.server) {
    let ch = undefined;
    for (i of channel.guild.channels.cache) {
      if (i[0] === db.log.server) {
        ch = i[1];
      }
    }
    const type = channel.type.charAt(0).toUpperCase() + channel.type.slice(1);
    let category = 'None';
    for (let i of channel.guild.channels.cache) {
      if (i[0] === channel.parentID) {
        category = i[1].name;
      }
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(`**${type} channel deleted**`)
      .setColor('#d7263d')
      .setDescription(`**Name:** ${channel.name}\n**Category:** ${category}`)
      .setFooter(`ID: ${channel.id}`)
      .setTimestamp();

    ch.send({ embed });
  }
};

const roleUpdate = async (oldRole, role) => {
  const db = await Glycer.findOne({ serverid: role.guild.id });
  const permsChange = require('./permsChange');
  if (db.log.server) {
    let channel = undefined;
    for (i of role.guild.channels.cache) {
      if (i[0] === db.log.def) {
        channel = i[1];
      }
    }
    const embed = new Discord.MessageEmbed();
    embed
      .setColor(`#0072BB`)
      .setTitle(`**Role "${role.name}" updated**`)
      .setFooter(`ID: ${role.id}`)
      .setTimestamp();
    let before = '';
    let after = '';
    if (oldRole.name !== role.name) {
      before = before + `**Name:** ${oldRole.name}\n`;
      after = after + `**Name:** ${role.name}\n`;
    }
    if (oldRole.color !== role.color) {
      before = before + `**Color:** #${oldRole.color.toString(16)}\n`;
      after = after + `**Color:** #${role.color.toString(16)}\n`;
    }
    if (oldRole.hoist !== role.hoist) {
      //channel.type.charAt(0).toUpperCase() + channel.type.slice(1)
      before = before + `**Separated:** ${oldRole.hoist}\n`;
      after = after + `**Separated:** ${role.hoist}\n`;
    }
    if (oldRole.mentionable !== role.mentionable) {
      before = before + `**Mentionable:** ${oldRole.mentionable}\n`;
      after = after + `**Mentionable:** ${oldRole.mentionable}\n`;
    }
    if (after && before) {
      embed.addFields(
        { name: '**Before**', value: `${before}`, inline: true },
        { name: '**After**', value: `${after}`, inline: true }
      );
    }

    if (oldRole.permissions !== role.permissions) {
      const perms = permsChange(oldRole, role);
      if (perms.added || perms.removed) {
        embed.addFields({
          name: '**Permissions**',
          value: `**Added:** ${perms.added}\n **Removed:** ${perms.removed}`,
          inline: true,
        });
      }
    }
    channel.send(embed);
  }
};

module.exports = {
  init,
  messageDelete,
  messageDeleteBulk,
  messageUpdate,
  userNew,
  userDelete,
  memberChange,
  roleNew,
  roleDelete,
  roleUpdate,
  voiceUpdate,
  channelNew,
  channelDelete,
};
