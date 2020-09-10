const Discord = require('discord.js');
const Glycer = require('../db/glycer');
const moment = require('moment');
const { updateAll } = require('./counter');

const init = async (message) => {
  const category = await message.guild.channels.create('Log', {
    type: 'category',
    permissionOverwrites: [
      {
        id: message.guild.roles.everyone.id,
        deny: ['VIEW_CHANNEL'],
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
    for (i of message.guild.channels.cache) {
      if (i[0] === db.log.messages) {
        channel = i[1];
      }
    }
    // let logs = await message.guild.fetchAuditLogs({ type: 72 });
    // let entry = logs.entries.first();
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

    channel.send({ embed });
  }
};

const messageUpdate = async (oldMessage, message, client) => {
  const db = await Glycer.findOne({ serverid: message.guild.id });

  if (process.env.BOT_ID === message.author.id) {
    return;
  }
  if (db.log.messages) {
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

    channel.send({ embed });
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
  if (db.log.messages) {
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

    channel.send({ embed });
  }
};

const userRemove = async (member) => {
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

    channel.send({ embed });
  }
};

module.exports = {
  init,
  messageDelete,
  messageUpdate,
  userNew,
  userRemove,
};
