const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const { prefix, token } = require('./config/config');
const {
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
} = require('./util/log');
const { updateAll } = require('./util/counter');
const { roleOnReact } = require('./util/roleOnReact');
require('./db/mongoose');

//R10 Heroku error
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Glycer is running!'));
app.listen(process.env.PORT || 3030, () => console.log('Listening'));

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', async () => {
  console.log('Ready!');
  for (let i of client.guilds.cache) {
    await updateAll(i[1]);
  }
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.on('messageDelete', async (message) => {
  await messageDelete(message);
});

client.on('messageDeleteBulk', async (messages) => {
  await messageDeleteBulk(messages, client);
});

client.on('messageUpdate', async (oldMessage, message) => {
  if (message.author.bot) return;
  await messageUpdate(oldMessage, message, client);
});

client.on('guildMemberAdd', async (member) => {
  await userNew(member);
});

client.on('guildMemberRemove', async (member) => {
  await userDelete(member);
});

client.on('guildMemberUpdate', async (oldMember, member) => {
  await memberChange(oldMember, member);
});

client.on('roleCreate', async (role) => {
  await roleNew(role);
});

client.on('roleDelete', async (role) => {
  await roleDelete(role);
});

client.on('roleUpdate', async (oldRole, role) => {
  await roleUpdate(oldRole, role);
});

client.on('voiceStateUpdate', async (oldState, state) => {
  await voiceUpdate(oldState, state);
});

client.on('channelCreate', async (channel) => {
  await channelNew(channel);
});

client.on('channelDelete', async (channel) => {
  await channelDelete(channel);
});

client.on('raw', (packet) => {
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
    return;
  }
  const serverId = packet.d.guild_id;
  const messageId = packet.d.message_id;
  const emoji = packet.d.emoji.name;
  const userId = packet.d.user_id;
  let remove = undefined;
  if (packet.t === 'MESSAGE_REACTION_REMOVE') {
    remove = true;
  }
  roleOnReact(serverId, messageId, emoji, userId, client, remove);
});

client.on('message', async (message) => {
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  try {
    command.execute(message, client);
  } catch (error) {
    console.error(error);
    message.reply(
      `There was an error trying to execute that command! \n ${error.message}`
    );
  }
});

client.login(token);
